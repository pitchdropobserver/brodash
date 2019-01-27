import { asyncPromLoop } from './_asyncPromLoop'

let dt: number, smallestLatencyObserved: number = Infinity  // lowest record of roundTripLatency polled

class ClockPoll {
	private emergencyStop = false
// assume initial client/server clock diff of 0 between client, server, currentTime calcualted locally per component when needed, clockDiff is updated periodically when more accurate data becomes available
	private clockDiff: number = 0
	private subscribers: Array<any> = []
	private testmode: { enabled: boolean, clockDiff: number } = {
		enabled: false,
		clockDiff: 0,
	}
	clockSyncLoop = undefined // reference
	private readonly clockSyncCountMax: number = 10
	private clockSyncCount = 0

	constructor(){
		this.animFrameUpdate = this.animFrameUpdate.bind(this)
	}

	public stop(): void{
		this.emergencyStop = true
	}

	public start(): void{
		this.emergencyStop = false
		this.animFrameUpdate()
	}

	private animFrameUpdate(timeStamp?: number) {
		const { clockDiff, subscribers, emergencyStop } = this
		// TWEEN.update(timeStamp)
		// animateItemsInQueue(timeStamp) //TEMP: to be removed
		// TODO: above, parameter 'timeStamp' is optional, this assumes on first run, subscribes array is empty and does not fire, this is an dangerous assumption
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

	public setTestmode(bool: boolean): void{
		this.testmode.enabled = bool
		this.syncClockOneTime()
	}

	private now(): number {
		return Date.now() - this.clockDiff
	}

	private pollServerForTime(): Promise<number>{
		const TIME_ENDPOINT = 'https://api.iextrading.com/1.0/time'
		return fetch(TIME_ENDPOINT).then(res => res.json())
	}

	private syncClientServerClock(): Promise<void>{
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

	public syncClockProgressively(): void{
		this.clockSyncLoop = asyncPromLoop.call({
			dichotomy: { ying: 'in', yang: 'out' },
			prom: this.syncClientServerClock.bind(this),
		}, 'in')
	}

	public syncClockOneTime(): Promise<void>{
		const me = this
		const pollStart: number = Date.now()
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

	calcClockDiff(optn: {
		clientTime: number
		serverTime: number
		roundTripLatency: number
	}){
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

	public setClockDiff(val: number): void {
		if (val) this.clockDiff = val
	}
	public getClockDiff(): number {
		return this.clockDiff
	}
	public subscribe(callback: Function, frequency: number, wait: number): void {
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
	public unsubscribe(callback: Function): void {
		this.subscribers = this.subscribers.filter((s) => {
			return callback !== s.callback
		})
	}
}

export const clockPoll = new ClockPoll()