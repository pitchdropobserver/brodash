// give array of pts, return all non-overlapping lines between nodes
export function linesLongestListWithin(arrPts){
	const lineIs3D = (arrPts[0].z === undefined) ? false : true
	const arrPtsCopy = [...arrPts]
	return arrPts.map(function(pt1, i){
		arrPtsCopy.shift()
		return arrPtsCopy.map(function(pt2, j){
			const line = {
				x1:pt1.x,
				y1:pt1.y,
				x2:pt2.x,
				y2:pt2.y,
			}
			if (lineIs3D){
				line.z1 = pt1.z
				line.z2 = pt2.z
			}
			return line
		})
	}).reduce(function(prev, arr){
		// flatten array 2d
		return prev.concat(arr)
	},[])
}

// given 2 arrays, return all non-overlapping lines between nodes
export function linesLongestListBetween(arrPts1, arrPts2){
	return arrPts1.map(function(pt1, i){
		return arrPts2.map(function(pt2, j){
			let line = {
				x1:pt1.x,
				y1:pt1.y,
				x2:pt2.x,
				y2:pt2.y,
			}
			return line
		})
	})
}

// return 2d array of overlapping connection btw every nodes
// cull undefined
export function linesXref(arrPts){
	const lineIs3D = (arrPts[0].z === undefined) ? false : true

	return arrPts.map(function(pt1, i){
		return arrPts.map(function(pt2, j){
			if(i !== j){
				const line = {
					x1:pt1.x,
					y1:pt1.y,
					x2:pt2.x,
					y2:pt2.y,
				}
				if (lineIs3D){
					line.z1 = pt1.z
					line.z2 = pt2.z
				}
				console.log('line',line)
				return line
			}
		}).filter(function(obj){
			// remove undefined
			if(obj){return true }
			else{return false }
		})
	})
}

// return 2d array of overlapping connection btw every nodes
// maintains index order of arrPts from perspective of 1 level arrays members
export function linesXrefKeepIndexOrder(arrPts){
	return arrPts.map(function(pt1, i){
		return arrPts.map(function(pt2, j){
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
	const arrArgs = Array.prototype.slice.apply(arguments)
	// some arguments are arrays, some are not, turn all arguments into array...
	let arg,
		params = [],
		longestListLen = 0,
		arrArgArrayOnly = new Array()
	for (let i = 0; i < arrArgs.length; i++) { // loop through every argument
		if(Array.isArray(arrArgs[i])){ // if already an array...
			arrArgArrayOnly[i] = arrArgs[i] // reference directly
		} else {
			arrArgArrayOnly[i] = [ arrArgs[i] ] // wrap in array.
		}
		longestListLen = Math.max(arrArgArrayOnly[i].length, longestListLen)
	}

	return function(callback){
		// march all arguments forward & supply to callback...
		let results = [],
			argSliceSingles // an array-slice containing all arguments across a particular index
		for (let i = 0; i < longestListLen; i++) {
			argSliceSingles = arrArgArrayOnly.map((array)=>{
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
