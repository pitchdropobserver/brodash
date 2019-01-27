type MathFunction = (t: number) => number

export const ease = {
	// no easing, no acceleration
	linear: <MathFunction>( t => t ),
	// accelerating from zero velocity
	InQuad: <MathFunction>(t => t * t ),
	// decelerating to zero velocity
	OutQuad: <MathFunction>(t => t * (2 - t) ),
	// acceleration util halfway, then deceleration
	InOutQuad: <MathFunction>(t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t ),
	// accelerating from zero velocity
	InCubic: <MathFunction>(t => t * t * t ),
	// decelerating to zero velocity
	OutCubic: <MathFunction>(t => (-t) * t * t + 1 ),
	// acceleration util halfway, then deceleration
	InOutCubic: <MathFunction>(t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 ),
	// accelerating from zero velocity
	InQuart: <MathFunction>(t => t * t * t * t ),
	// decelerating to zero velocity
	OutQuart: <MathFunction>(t => 1 - (-t) * t * t * t ),
	// acceleration util halfway, then deceleration
	InOutQuart: <MathFunction>(t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (-t) * t * t * t ),
	// accelerating from zero velocity
	InQuint: <MathFunction>(t => t * t * t * t * t ),
	// decelerating to zero velocity
	OutQuint: <MathFunction>(t => 1 + (-t) * t * t * t * t ),
	// acceleration util halfway, then deceleration
	InOutQuint: <MathFunction>(t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (-t) * t * t * t * t ),
}

export function getLogByBase(base: number, x: number): number {
	return Math.log(x) / Math.log(base)
}

export function getLogBase2(x: number): number{
	return getLogByBase(2, x)
}

export function radToDeg(rad: number, round: number = 0): number {
	return Number((180 / Math.PI * rad).toFixed(round))
}

export function getHash(): string {
	return Math.random().toString(36).substring(2, 15)
}

export function getUniqueHashOnObj(obj: Object): string{
	const hashKey = getHash()
	return obj.hasOwnProperty(hashKey) ?
		getUniqueHashOnObj(obj) // try again on collision
			: hashKey
}

export function capBtw(floor: number, num: number, ceil: number): number {
	return Math.min(Math.max(num, floor), ceil)
}

export function roundTo(num: number, precision: number): number{
	const factor: number = Math.pow(10, precision)
	return Math.round(num * factor) / factor
}


export function getPrecisionFormattedText(val: number, precision: number = 0): string {
	if(precision > 0){ // 0.1, 0.001, 0.0001...
		// force number of digits displayed.
		return Number(val).toFixed(precision)
	} else { // 10, 100, 1000...
		return roundTo(val, precision).toString()
	}
}

/**
 * Translate a value into unit interval based on its expected range
 * @param {number} val - A value
 * @param {number} range_min - Minimum possible value
 * @param {number} range_max - Maximum possible value
 * @return {number} - A value between 0 - 1
 */
export function reMapToUnitInterval(val: number, range_min: number, range_max: number): number {
	const relativePct = (val - range_min) / (range_max - range_min)
	return capBtw(0, relativePct, 1.0)
}
