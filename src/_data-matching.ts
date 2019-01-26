import { ILine, IPt } from './_interfaces'

// give array of pts, return all non-overlapping lines between nodes
export function linesLongestListWithin(arrPts: Array<IPt>): Array<ILine>{
	const is3dLine: boolean = arrPts[0].z !== undefined
	const arrPtsCopy: Array<IPt> = arrPts.slice()
	return arrPts.map((pt1) => {
		arrPtsCopy.shift()
		return arrPtsCopy.map((pt2) => {
			if (is3dLine){
				return {
					x1: pt1.x, y1: pt1.y, z1: pt1.z,
					x2: pt2.x, y2: pt2.y, z2: pt2.z,
				}
			} else {
				return {
					x1: pt1.x, y1: pt1.y,
					x2: pt2.x, y2: pt2.y,
				}
			}
		})
	}).reduce((prev, arr)=>{
		// flatten array 2d
		return prev.concat(arr)
	},[])
}

// given 2 arrays, return all non-overlapping lines between nodes
export function linesLongestListBetween(arrPts1: Array<IPt>, arrPts2: Array<IPt>): Array<Array<ILine>>{
	return arrPts1.map((pt1, i) => {
		return arrPts2.map((pt2, j) => {
			return {
				x1: pt1.x,
				y1: pt1.y,
				x2: pt2.x,
				y2: pt2.y,
			}
		})
	})
}

// return 2d array of overlapping connection btw every nodes
// cull undefined
export function linesXref(arrPts: Array<IPt>): Array<Array<ILine|undefined>> {
	const is3dLine: boolean = arrPts[0].z !== undefined
	return arrPts.map((pt1, i) => {
		return arrPts.map((pt2, j) => {
			if(i !== j){
				if (is3dLine) {
					return {
						x1: pt1.x, y1: pt1.y, z1: pt1.z,
						x2: pt2.x, y2: pt2.y, z2: pt2.z,
					}
				} else {
					return {
						x1: pt1.x, y1: pt1.y,
						x2: pt2.x, y2: pt2.y,
					}
				}
			}
		}).filter(obj => obj !== undefined)
	})
}

// return 2d array of overlapping connection btw every nodes
// maintains index order of arrPts from perspective of 1 level arrays members
export function linesXrefKeepIndexOrder(arrPts: Array<IPt>): Array<ILine[]>{
	return arrPts.map((pt1) => {
		return arrPts.map((pt2) => {
			return {
				x1:pt1.x,
				y1:pt1.y,
				x2:pt2.x,
				y2:pt2.y,
			}
		})
	})
}

/**
 * March all arguments forward forward & supply to callback until longest argument array is exhausted...
 * @param {*} - any object or primitives in singular or array form.
 * @return {function} - a function that receives callback function to process the arguments.
 */
export function marchDataLongestList(){
	const arrArgs: any[] = Array.prototype.slice.apply(arguments)
	// some arguments are arrays, some are not, turn all arguments into array...
	let longestListLen: number = 0,
		arrArgArrayOnly: any[] = new Array()
	for (let i = 0; i < arrArgs.length; i++) { // loop through every argument
		if(Array.isArray(arrArgs[i])){ // if already an array...
			arrArgArrayOnly[i] = arrArgs[i] // reference directly
		} else {
			arrArgArrayOnly[i] = [ arrArgs[i] ] // wrap in array.
		}
		longestListLen = Math.max(arrArgArrayOnly[i].length, longestListLen)
	}

	return function(callback: Function): any {
		// march all arguments forward & supply to callback...
		let results: any[] = [],
			argSliceSingles: any[] // an array-slice containing all arguments across a particular index
		for (let i = 0; i < longestListLen; i++) {
			argSliceSingles = arrArgArrayOnly.map((array: any[])=>{
				if(array[i] === undefined){ // out of bounds...
					return array[array.length-1] // return value at last valid index.
				} else { // within bounds....
					return array[i] // return value at current index.
				}
			})
			results.push(
				callback.apply(null, argSliceSingles)
			)
		}

		if(longestListLen === 1){ // if all arg are singles wrapped in array...
			return results[0] // return single
		} else {
			return results // return array
		}
	}
}
