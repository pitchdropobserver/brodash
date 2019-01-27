import { IPt } from './_interfaces'
import { getValType, isObj } from './_misc'

/**
 * if parent object has nested object with key 'val',
 * assign 'val' value directly to parent object
 * @param {Object} oParam - obj with or without nested object with .val
 * @return {Object}
 */
export function rebuildValObjs(oParam){
	return deepCopyObj(oParam, function objFilter(obj){
		if(obj.hasOwnProperty('val')){
			return obj.val
		} else {
			return obj
		}
	})
}

export function deepCopyArray(array: any[], objFilter?: Function): any {
	return array.map((item) => {
		switch (getValType(item)){
			case 'array':
				return deepCopyArray(item)
			case 'object':
				if(typeof objFilter === 'function'){
					return deepCopyObj(objFilter(item))
				} else {
					return deepCopyObj(item)
				}
			default:
				return item
		}
	})
}

/**
 * Shallow copy an object. Otionally skipping over provided keys.
 * @param {Object} obj - Object to be copied
 * @param {...string} skippedKeys - Lists of keys to skip over
 * @return {Object} - New object
 */
export function copy(obj: Object, ...skippedKeys: PropertyKey[]): Object {
	return Object.keys(obj).reduce((prev, key)=>{
		if (skippedKeys.indexOf(key) === -1){ // if not blacklisted...
			prev[key] = obj[key] // assign directly
		}
		return prev
	}, {})
}

/**
 *
 * @param {Object} obj - object to be cloned
 * @param {Object} objFilter - optional, user function called when item is object
 * @returns {Object} - cloned object (if object) or the original value
 */
export function deepCopyObj<T>(obj: T, objFilter?: Function): Object|T {
	if(getValType(obj) === 'object'){ // only proceed if obj...
		const clone: Object = {}
		let key: PropertyKey, item: any
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				item = obj[key]
				switch (getValType(item)) {
					case 'array':
						clone[key] = deepCopyArray(item, objFilter)
						break
					case 'object':
						if(objFilter){
							clone[key] = deepCopyObj(objFilter(item), objFilter)
						} else {
							clone[key] = deepCopyObj(item)
						}
						break
					default:
						clone[key] = item
				}
			}
		}
		return clone
	} else {
		return obj
	}
}

/**
 * Merge two object, if a key exists on both object whose value are also both objects, then recursively merge them again.
 * @param {Object} first - Object to merge into
 * @param {Object} second - Object to merge from
 * @param  {...string} specialKeys - keys assigned directly from 2nd to 1st
 */
export function deepMergeTwoObjs(first: Object, second: Object, ...specialKeys: PropertyKey[]): Object {
	if (arguments.length < 2) throw 'Methods requires 2 objects!'
	if (isObj(first) && isObj(second)){
		Object.keys(second).forEach((keyOn2nd) => {
			if (specialKeys.indexOf(keyOn2nd) === -1){ // not blacklisted...
				if (isObj(second[keyOn2nd])) {
					if (isObj(first[keyOn2nd])) {
						// val on both are objects
						deepMergeTwoObjs(first[keyOn2nd], second[keyOn2nd])
					} else {
						// val on 2nd is obj, not 1st
						first[keyOn2nd] = second[keyOn2nd]
					}
				} else {
					// val on 2nd is not obj
					first[keyOn2nd] = second[keyOn2nd]
				}
			} else { // is a key to assign directly
				first[keyOn2nd] = second[keyOn2nd]
			}		
		})
		return first
	} else {
		throw "First two arguments must be objects!"
	}
}


/**
 * Convert array of point objs into comma separated string
 * @param {Array} arrPts Array of xy points
 * @return {string} Comma-separated string of xy coordinates
 */
export function arrPts2Str(arrPts: IPt[]): string {
	return arrPts.map(pt => pt.x + ',' + pt.y).join(',')
}

// // loop through arr 2d, do something, get results in arr 1d
// // callback recieves current obj, index
// export function loopArr2dReturn1d(arr2D, callback){
// 	return arr2D.reduce(function(prev, arr){
// 		prev = prev.concat(
// 			arr.map(function(obj, index){
// 				return callback(obj, index)
// 			})
// 		)
// 		return prev
// 	},[])
// }

// export function mergeArrays(arr1: any[], arr2: any[]): any[]{
// 	return (arr1.length <= arr2.length) ?
// 		arr2.reduce(function(prev,obj,index){
// 			prev.push(obj)
// 			if(arr1[index]){
// 				prev.push(arr1[index])
// 			}
// 			return prev
// 		},[]) : arr1.reduce(function(prev,obj,index){
// 			prev.push(obj)
// 			if(arr2[index]){
// 				prev.push(arr2[index])
// 			}
// 			return prev
// 		},[])
// }


/**
 * Shuffle items in an array
 * @param {Array} array An array of values
 * @return {Array} The original array shuffled
 */
export function shuffleArray<T>(array: T[]): T[] {
	return fisherYatesShuffle<T>(array)
}

/**
 * Fisher-Yates Shuffle (Knuth Shuffle)
 * @param {array} original - Original array
 * @returns {array} - New shuffled array
 */
export function fisherYatesShuffle<T>(original: T[]): T[] {
	const arr: T[] = original.slice()
	let tempVal: any, randIndex: number, currentIndex: number = arr.length
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randIndex = Math.floor(Math.random() * currentIndex)
		currentIndex -= 1
		// And swap it with the current element.
		tempVal = arr[currentIndex]
		arr[currentIndex] = arr[randIndex]
		arr[randIndex] = tempVal
	}
	return arr
}


type SortFunc = (A: any, B: any) => number

const SORT_METHODS = {
	'number':{
		asc: <SortFunc>((A, B) => {
			if(isNaN(A)){
				return 1 // move item to bottom...
			} else if (isNaN(B)){
				return 1 // move item to bottom...
			} else { // comparing 2 numbers
				return A - B
			}
		}),
		dsc: <SortFunc>((A, B) => {
			if(isNaN(A)){
				return 1 // move item to bottom...
			} else if (isNaN(B)){
				return 1 // move item to bottom...
			} else { // comparing 2 numbers
				return B - A
			}
		})
	},
	'string':{
		asc: <SortFunc>((A, B) => {
			const charCodeA = A.charCodeAt(0)
			const charCodeB = B.charCodeAt(0)
			if(isNaN(charCodeA) && isNaN(charCodeB)){
				return 1 // move item to bottom...
			} else {
				// comparison only meaningful if neither values are non-empty strings
				return charCodeA - charCodeB
			}
		}),
		dsc: <SortFunc>((A, B) => {
			const charCodeA = A.charCodeAt(0)
			const charCodeB = B.charCodeAt(0)
			if(isNaN(charCodeA) && isNaN(charCodeB)){
				return 1 // move item to bottom...
			} else {
				// comparison only meaningful if neither values are non-empty strings
				return charCodeB - charCodeA
			}
		}),
	}
}

export function getSortMethod(dataType: string): Function {
	const sortMethodByDataType: SortFunc = SORT_METHODS[dataType]
	return (sortDir: string): Function => {
		return sortMethodByDataType !== undefined ? 
			sortMethodByDataType[sortDir]
				: () => 0 // no sort
	}
}

export function collectUniques(arrA: any[], arrB: any[]): void {
	for (let i = 0; i < arrB.length; i++) {
		if(arrA.indexOf(arrB[i]) === -1){
			arrA.push(arrB[i])
		}
	}
}


type Action = {
	type: string
	index: number,
}
/**
 * Compare an old and a new array, determine a list of CRUD actions to transform old array into new array.
 * @param {Array} arrOld Existing array
 * @param {Array} arrNew New array
 * @return {Array} List of CRUD action objects
 */
export function diff2Arrays(arrOld: any[], arrNew: any[]): Action[] {
	const lenDiff: number = arrNew.length - arrOld.length
	const actionsOnOldArray: Action[] = []
	if(lenDiff === 0){ // if same length
		for (let i = 0; i < arrNew.length; i++) {
			actionsOnOldArray.push({
				type: 'UPDATE',
				index: i,
			})
		}
	} else if(lenDiff > 0){ // if more items in new array
		for (let i = 0; i < arrNew.length; i++) {
			if(i < arrOld.length){ // if INSIDE bounds of OLD array
				actionsOnOldArray.push({
					type: 'UPDATE',
					index: i,
				})
			} else { // if OUTSIDE bounds of OLD array
				actionsOnOldArray.push({
					type: 'CREATE',
					index: i,
				})
			}
		}
	} else { // if more items in old array
		for (let i = 0; i < arrOld.length; i++) {
			if(i < arrNew.length){ // if INSIDE bounds of NEW array
				actionsOnOldArray.push({
					type: 'UPDATE',
					index: i,
				})
			} else { // if OUTSIDE bounds of NEW array
				actionsOnOldArray.push({
					type: 'DELETE',
					index: i,
				})
			}
		}
	}
	return actionsOnOldArray
}


type CompFunc = (A: any, B: any) => boolean

/**
 * Compare 2 arrays (of unique items) to see they both describe the same combination of items.
 * @param {Array} arrA Array of unique items
 * @param {Array} arrB Another array of unique items
 * @param {Function} compare - a comparison function for items in array, defaults to triple equal check.
 * @return {boolean} False if 2 arrays contains different combination of items
 */
export function areOfSameSet(arrA: any[] = [], arrB: any[] = [], compare: CompFunc = ((a, b) => a === b)): boolean {
	if(arrA.length === arrB.length){ // if same number of items
		let existsInB: boolean
		for (let i = 0; i < arrA.length; i++) {
			// check if every item in A also exists in B
			existsInB = arrB.some((B, i)=>{
				return compare(arrA[i], B)
			})
			if(!existsInB) return false
		}
		return true
	} else {
		return false // cannot be same combination of items if set size differs.
	}
}

/**
 * Copy an array of items in a sequence where certain items are placed at the front
 * @param {Array} arr Array of items
 * @param {Function} match Function to identify which items to place at front.
 * @returns {Array} New array with identified items at the front
 */
export function copyItemsToFront<T> (arr: T[], match: Function): T[]{
	const sortedArray: T[] = []
	for (let i = 0; i < arr.length; i++) {		
		if (match(arr[i])){
			sortedArray.unshift(arr[i]) // copy item to front
		} else {
			sortedArray.push(arr[i]) // copy item to back
		}
	}
	return sortedArray
}

/**
 * Create an object with key/vals pairs from those that differ between a source object and the reference object
 * @param  {Object} src Object with new data
 * @param  {Object} ref Object with key/val pairs used for reference
 * @return {Object} New object with key/vals pairs or false
 */
export function collectPropsDelta(src: Object, ref: Object): Object {
	let didPropsChange: boolean = false
	const changedProps: Object = Object.keys(ref).reduce((prev, key)=>{
		if(
			key in src &&
			src[key] !== ref[key]
		){
			didPropsChange = true
			prev[key] = src[key]
		}
		return prev
	},{})
	if(didPropsChange){
		return changedProps
	} else {
		return null
	}
}

export function cullRandomItemInArray<T>(arrSource: T[], numItems: number): T[] {	const arrNew: T[] = new Array()
	let randIndex: number
	for (let i = 0; i < numItems; i++) {
		randIndex = Math.floor(Math.random() * arrSource.length)
		arrNew.push(arrSource.splice(randIndex, 1)[0])
	}
	return arrNew
}