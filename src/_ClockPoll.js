import { asyncPromLoop } from './_asyncPromLoop'

var dt, smallestLatencyObserved = Infinity  // lowest record of roundTripLatency polled

export class ClockPoll {
	constructor(){
		this.last = undefined
		this.dt = undefined
		this.emergencyStop = false
		// assume initial client/server clock diff of 0 between client, server, currentTime calcualted locally per component when needed, clockDiff is updated periodically when more accurate data becomes available
		this.clockDiff = 0
		this.subscribers = []
		this.testmode = {
			enabled:false,
			clockDiff:0,
		}
		this.clockSyncLoop = undefined // reference
		this.clockSyncCountMax = 10
		this.clockSyncCount = 0
	
		this.animFrameUpdate = this.animFrameUpdate.bind(this)
	}

	stop(){
		this.emergencyStop = true
	}

	start() {
		this.emergencyStop = false
		this.animFrameUpdate()
	}

	animFrameUpdate(timeStamp) {
		const { clockDiff, subscribers, emergencyStop } = this
		// TWEEN.update(timeStamp)
		// animateItemsInQueue(timeStamp) //TEMP: to be removed

		subscribers.forEach((s) => {
			dt = timeStamp - s.last // calculate individual dt's for each subscriber
			if (dt >= s.frequency) {
				if (s.wait) { // for data calls...
					if (!s.wait.midFlight) { // only update if last call returned
						s.callback(timeStamp - clockDiff, dt)
						s.last = timeStamp
					}
				} else { // for non-waiting calls...
					s.callback(timeStamp - clockDiff, dt)
					s.last = timeStamp
				}
			}
		})
		if (!emergencyStop) {
			requestAnimationFrame(this.animFrameUpdate)
		}
	}

	setTestmode(bool){
		this.testmode.enabled = bool
		this.syncClockOneTime()
	}

	now(){
		return Date.now() - this.clockDiff
	}

	pollServerForTime(){
		return fetch('https://api.iextrading.com/1.0/time').then(function (res) {
			return res.json()
		})
	}

	syncClientServerClock(){
		const me = this
		if (this.clockSyncCount < this.clockSyncCountMax) {
			return this.syncClockOneTime().then(()=>{
				console.log('observed client/server round trip latency --> ' + smallestLatencyObserved + ' ms')
				me.clockSyncCount++
			})
		} else {
			this.clockSyncLoop.stop()
			this.clockSyncLoop = undefined
			this.clockSyncCount = 0 // reset
			console.log('---------------- client/server clock sync result -----------------------')
			console.log('client/server clock sync\'ed for ' + this.clockSyncCountMax + ' times')
			console.log('fastest round trip latency observed --> ' + smallestLatencyObserved + ' ms')
			console.log('best guess of clock diff -->: ' + this.clockDiff + ' ms')
			console.log('------------------------------------------------------------------------')
			return Promise.resolve()
		}
	}

	syncClockProgressively(){
		this.clockSyncLoop = asyncPromLoop.call({
			dichotomy: { ying: 'in', yang: 'out' },
			prom: this.syncClientServerClock.bind(this),
		}, 'in')
	}

	syncClockOneTime(){
		const me = this
		const pollStart = Date.now()
		return this.pollServerForTime().then(function calcLatency(polledServerTime) {
			console.log('polledServerTime', polledServerTime)

			const pollClose = Date.now() // client now
			// console.log('client time before polling --> ', moment(pollStart).format('HH:mm:ss'))
			// console.log('polled server time --> ', moment(polledServerTime).format('HH:mm:ss'))
			// console.log('roundTripLatency ms', pollClose - pollStart)
			const clockDiff = me.calcClockDiff({
				clientTime: pollStart,
				serverTime: polledServerTime,
				// NOTE: must use ABS val below, since time travelling to earlier time will produce a negative roundTripLatency which prevents the water mark to be reset later on. the point of the watermark (smallestLatencyObserved) is to chase after a value of 0
				// roundTripLatency: Math.abs(pollClose - pollStart),
				roundTripLatency: pollClose - pollStart,
			})
			// console.log('clockDiff--->',clockDiff)
			if (clockDiff) me.setClockDiff(clockDiff)
		})
	}

	calcClockDiff(optn){
		const { testmode } = this
		const { clientTime, serverTime, roundTripLatency } = optn
		if (testmode.enabled) {
			return testmode.clockDiff
		} else {
			if (roundTripLatency < smallestLatencyObserved) { // if lower latency found
				smallestLatencyObserved = roundTripLatency  // set new record for smallest latency observed
				// use new lat record to calculate clockDiff, as a smaller latency provide smaller margin of error
			}
			return Math.round((clientTime - serverTime) + smallestLatencyObserved / 2)
		}
	}

	setClockDiff(val) {
		if (val) this.clockDiff = val
	}
	getClockDiff() {
		return this.clockDiff
	}
	subscribe(callback, frequency, wait) {
		const duplicate = this.subscribers.find(function (s) {
			return callback === s.callback
		})
		if (duplicate === undefined) {
			this.subscribers.push({
				frequency,
				callback,
				last: 0,
				wait,
			})
		}
	}
	unsubscribe(callback) {
		this.subscribers = this.subscribers.filter(function (s) {
			return callback !== s.callback
		})
	}
}

