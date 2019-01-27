/**
 * Fetch a random item from the given array.
 * @param {array} arr - array of items
 * @return {object} - an item in the array
 */
export function getRandInArr<T>(arr: Array<T>): T{
	return arr[Math.floor(Math.random()*arr.length)]
}


type WeightedObj = {
	weight: number
	[key: string]: any
}
type Range = {
	min: number
	max: number
	obj: WeightedObj
}
/**
 * Select weighted randoms from array.
 * @param {array} arrObj - array of objects, obj.weight sums to 1.0
 * @return {object} - an item in the array
 */
export function getWeightedRandInArr(arrObj: WeightedObj[]): WeightedObj|undefined {
	const seed: number = Math.random()
	const sorted = arrObj.sort((a, b) => a.weight - b.weight )
	// create artifical range per item based on weight
	let watermark: number = 0
	const ranges: Range[] = sorted.reduce((prev: Range[], obj: WeightedObj) => {
		prev.push({
			min: watermark,
			max: watermark + obj.weight,
			obj,
		})
		watermark += obj.weight
		return prev
	},[])
	// check where seed falls in range, return associated obj
	const selected = ranges.find((obj) => {
		return seed >= obj.min && seed <= obj.max
	})
	return selected && selected.obj
}

/**
 * Get a random number between two numbers, inclusive.
 * @param {number} start - the smallest returnable number
 * @param {number} end - the largest returnable number
 * @return {number} - a number within range
 */
export function getRandInRange(start: number, end: number): number {
	return start + Math.random() * (end - start)
}
