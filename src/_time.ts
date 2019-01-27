// export function getUnix(hr, min, sec, milli){
// 	return (
// 		moment()
// 		.hour(hr)
// 		.minute(min ? min : 0)
// 		.second(sec ? sec : 0)
// 		.millisecond(milli ? milli : 0 )
// 		.format('x')
// 	)
// }

export function getMinTodayMoment(oMoment: any){
	return (
		oMoment.hour() * 60
		+ oMoment.minute()
	)
}

export function getSecTodayMoment(oMoment: any){
	return (
		getMinTodayMoment(oMoment) * 60
		+ oMoment.seconds()
	)
}

export function getMilliTodayMoment(oMoment: any){
	return (
		getSecTodayMoment(oMoment) * 1000
		+ oMoment.millisecond()
	)
}

export function getMinToday(hr: number, min: number): number {
	return (
		hr * 60
		+ (min ? min : 0)
	)
}

export function getSecToday(hr: number, min: number, sec: number): number {
	return (
		getMinToday(hr, min) * 60
		+ (sec ? sec : 0)
	)
}

export function getMilliToday(hr: number, min: number, sec: number, milli: number): number{
	return (
		getSecToday(hr, min, sec) * 1000
		+ (milli ? milli : 0)
	)
}
