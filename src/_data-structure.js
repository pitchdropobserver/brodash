import { getValType, isObj } from './_misc'

export function objOrArr(obj){
	if(Array.isArray(obj)){ // if array
		return 'array'
	} else if ( typeof obj === 'object' && obj !== null){ // if object
		return 'object'
	} else { // others: Number, String, undefined, null
		return 'other'
	}
}

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

export function deepCopyArray(array, objFilter){
	return array.map(function(item){
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
export function copy(obj, ...skippedKeys) {
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
export function deepCopyObj(obj, objFilter){
	if(getValType(obj) === 'object'){ // only proceed if obj...
		const clone = {}
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				const item = obj[key]

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
export function deepMergeTwoObjs(first, second, ...specialKeys){
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

// convert arr of pt-objs into arr of str
export function arrPts2Str(arrPts){
	return arrPts.map(function(pt){
		return pt.x + ',' + pt.y
	}).join(',')
	// return arrPts.reduce(function(prev, pt){
	// 	prev.push(pt.x + ',' + pt.y)
	// 	return prev
	// },[])
}

// loop through arr 2d, do something, get results in arr 1d
// callback recieves current obj, index
export function loopArr2dReturn1d(arr2D, callback){
	return arr2D.reduce(function(prev, arr){
		prev = prev.concat(
			arr.map(function(obj, index){
				return callback(obj, index)
			})
		)
		return prev
	},[])
}

export function mergeArrays(arr1,arr2){
	return (arr1.length <= arr2.length) ?
		arr2.reduce(function(prev,obj,index){
			prev.push(obj)
			if(arr1[index]){
				prev.push(arr1[index])
			}
			return prev
		},[]) : arr1.reduce(function(prev,obj,index){
			prev.push(obj)
			if(arr2[index]){
				prev.push(arr2[index])
			}
			return prev
		},[])
}

/**
 * Fisher-Yates Shuffle (Knuth Shuffle)
 * @param {array} original - original array
 * @returns {array} - new shuffled array
 */
export function fisherYatesShuffle(original){
	const arr = original.slice()
	let temporaryValue, randomIndex, currentIndex = arr.length
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex -= 1
		// And swap it with the current element.
		temporaryValue = arr[currentIndex]
		arr[currentIndex] = arr[randomIndex]
		arr[randomIndex] = temporaryValue
	}
	return arr
}


const SORT_METHODS = {
	'number':{
		asc: (A, B) => {
			if(isNaN(A)){
				return 1 // move item to bottom...
			} else if (isNaN(B)){
				return 1 // move item to bottom...
			} else { // comparing 2 numbers
				return A - B
			}
		},
		dsc: (A, B) => {
			if(isNaN(A)){
				return 1 // move item to bottom...
			} else if (isNaN(B)){
				return 1 // move item to bottom...
			} else { // comparing 2 numbers
				return B - A
			}
		}
	},
	'string':{
		asc: (A, B) => {
			const charCodeA = A.charCodeAt(0)
			const charCodeB = B.charCodeAt(0)
			if(isNaN(charCodeA) && isNaN(charCodeB)){
				return 1 // move item to bottom...
			} else {
				// comparison only meaningful if neither values are non-empty strings
				return charCodeA - charCodeB
			}
		},
		dsc: (A, B) => {
			const charCodeA = A.charCodeAt(0)
			const charCodeB = B.charCodeAt(0)
			if(isNaN(charCodeA) && isNaN(charCodeB)){
				return 1 // move item to bottom...
			} else {
				// comparison only meaningful if neither values are non-empty strings
				return charCodeB - charCodeA
			}
		},
	}
}

export function getSortMethod(dataType){
	const sortMethodByDataType = SORT_METHODS[dataType]
	return (sortDir)=>{
		if(sortMethodByDataType !== undefined){
			return sortMethodByDataType[sortDir]
		} else {
			return (A, B) => 0 // no sort
		}
	}
}

export function collectUniques(arrA, arrB){
	for (let i = 0; i < arrB.length; i++) {
		if(arrA.indexOf(arrB[i]) === -1){
			arrA.push(arrB[i])
		}
	}
}

/**
 * Compare an old and a new array, determine a list of CRUD actions to transform old array into new array.
 * @param {array} arrOld - existing array
 * @param {array} arrNew - new array
 * @returns {array} - a list of CRUD strings
 */
export function diff2Arrays(arrOld, arrNew){
	const lenDiff = arrNew.length - arrOld.length

	const actionsOnOldArray = []
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


/**
 * Compare 2 arrays (of unique items) to see they both describe the same combination of items.
 * @param {array} arrA - an array of unique items
 * @param {array} arrB - a second  array of unique items
 * @param {function} compare - a comparison function for items in array, defaults to triple equal check.
 * @returns {bool} - false if 2 arrays contains different combination of items
 */
export function areOfSameSet(
	arrA = [],
	arrB = [],
	compare = ((a, b) => a === b)
){
	if(arrA.length === arrB.length){ // if same number of items
		let existsInB
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
 * @param {array} arr - an array of items
 * @param {function} match - a function to identify which items to place at front.
 * @returns {array} - a new array with identified items at the front
 */
export function copyItemsToFront(arr, match){
	const sortedArray = []
	for (let i = 0; i < arr.length; i++) {
		arr[i]
		if(match){
			sortedArray.unshift(arr[i]) // copy item to front
		} else {
			sortedArray.push(arr[i]) // copy item to back
		}
	}
	return sortedArray
}


/**
 * Create an object with key/vals pairs from those that differ between a source object and the reference object
 * @param  {Object} src - an object to with new data
 * @param  {Object} ref - an object with key/val pairs used for reference
 * @return {Object|boolean} - a new object with key/vals pairs or false
 */
export function collectPropsDelta(src, ref){
	let didPropsChange = false
	const changedProps = Object.keys(ref).reduce((prev, key)=>{
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
		return false
	}
}


/**
 * Fisher Yates Shuffle
 * @param {Array} - An array of values
 * @return {Array} - The original array
 */
export function shuffleArray(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}


export function cullRandomItemInArray(arrSource, intItems) {
	const arrNew = []
	var randIndex
	for (let i = 0; i < intItems; i++) {
		randIndex = Math.floor(Math.random() * arrSource.length)
		arrNew.push(arrSource.splice(randIndex, 1)[0])
	}
	return arrNew
}