/**
 * Fetch a random item from the given array.
 * @param {array} arr - array of items
 * @return {object} - an item in the array
 */
export function getRandInArr(arr){
	return arr[Math.floor(Math.random()*arr.length)]
}

/**
 * Select weighted randoms from array.
 * @param {array} arrObj - array of objects, obj.weight sums to 1.0
 * @return {object} - an item in the array
 */
export function getWeightedRandInArr(arrObj){
	const seed = Math.random()
	const sorted = arrObj.sort(function(a, b){ return a.weight - b.weight })
	// create artifical range per item based on weight
	let watermark = 0
	const ranges = sorted.reduce(function(prev, obj, i){
		prev.push({
			min:watermark,
			max:watermark + obj.weight,
			obj,
		})
		watermark += obj.weight
		return prev
	},[])
	// check where seed falls in range, return associated obj
	const selected = ranges.find(function(obj){
		return seed >= obj.min && seed <= obj.max
	})
	return selected.obj
}

/**
 * Get a random number between two numbers, inclusive.
 * @param {number} start - the smallest returnable number
 * @param {number} end - the largest returnable number
 * @return {number} - a number within range
 */
export function getRandInRange(start, end){
	return start + Math.random() * (end - start)
}
