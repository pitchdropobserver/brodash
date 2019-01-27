// ---- USE CASE ---- //
// const loop = asyncPromLoop.call({
// 	prom:function(state){
// 		return new Promise(function(){
// 			// do something
// 		})
// 	},
// 	dichotomy:{
// 		ying:'in',
// 		yang:'out',
// 	},
// },'in')

type Stop = {
	stop: number
	state?: string
}

export function asyncPromLoop(state: string, argStop: Stop): Object{
	let oStop = argStop ? argStop : { stop:1 }
	oStop.state = state // overrides
	this.prom(state).then(()=>{ // primary action
		// after primary action executed
		if(oStop.stop !== 0){
			oStop.stop++ // loop breaks at 0, otherwise increments
			const newState = state === this.dichotomy.ying ? this.dichotomy.yang : this.dichotomy.ying
			asyncPromLoop.call(this, newState, oStop)
		}
	})

	if(!argStop){
		return {
			stop(): string {
				oStop.stop = 0
				return oStop.state
			},
			getState(): string{
				return oStop.state
			},
			stopAt(strState: string): void {
				if(oStop.state === strState){
					oStop.stop = 0 // stop after current loop
				} else {
					oStop.stop = -1 // stop after next loop
				}
			},
		}
	}
}

