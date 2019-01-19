export const ease = {
	// no easing, no acceleration
	linear: function (t) { return t },
	// accelerating from zero velocity
	InQuad: function (t) { return t * t },
	// decelerating to zero velocity
	OutQuad: function (t) { return t * (2 - t) },
	// acceleration util halfway, then deceleration
	InOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
	// accelerating from zero velocity
	InCubic: function (t) { return t * t * t },
	// decelerating to zero velocity
	OutCubic: function (t) { return (-t) * t * t + 1 },
	// acceleration util halfway, then deceleration
	InOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
	// accelerating from zero velocity
	InQuart: function (t) { return t * t * t * t },
	// decelerating to zero velocity
	OutQuart: function (t) { return 1 - (-t) * t * t * t },
	// acceleration util halfway, then deceleration
	InOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (-t) * t * t * t },
	// accelerating from zero velocity
	InQuint: function (t) { return t * t * t * t * t },
	// decelerating to zero velocity
	OutQuint: function (t) { return 1 + (-t) * t * t * t * t },
	// acceleration util halfway, then deceleration
	InOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (-t) * t * t * t * t }
}

export function getLogByBase(base, x) {
	return Math.log(x) / Math.log(base);
}

export function getLogBase2(x){
	return getLogByBase(2, x)
}

export function radToDeg(rad, round = 0){
	return Number((180 / Math.PI * rad).toFixed(round))
}

export function getHash(){
	return Math.random().toString(36).substring(2, 15)
}

export function getUniqueHashOnObj(obj){
	const hashKey = getHash()
	return obj.hasOwnProperty(hashKey) ?
		getUniqueHashOnObj(obj) // try again on collision
			: hashKey
}

export function capBtw(floor, num, ceil){
	return Math.min(Math.max(num, floor), ceil)
}

export function roundTo(num, precision){
	const factor = Math.pow(10, precision)
	return Math.round(num * factor) / factor
}


export function getPrecisionFormattedText(val, precision = 0){
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
export function reMapToUnitInterval(val, range_min, range_max) {
	const relativePct = (val - range_min) / (range_max - range_min)
	return capBtw(0, relativePct, 1.0)
}
