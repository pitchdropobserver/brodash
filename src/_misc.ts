export function param(val: any, paramType: string, paramVals: any): Object {
	if(paramType === 'colorHex'){
		return {
			val,
			paramType,
		}
	} else if(
		paramType === 'minMax' ||
		paramType === 'minMaxInt'
	){
		if(Array.isArray(paramVals)){ // as range
			return {
				val,
				paramType,
				paramVals:{min:paramVals[0], max:paramVals[1]}
			}
		}
		if(!isNaN(paramVals)){ // as offset to  val
			return {
				val,
				paramType,
				paramVals:{
					min:val - paramVals,
					max:val + paramVals
				}
			}
		}
	} else {
		return {
			val,
			paramType:'string',
		}
	}
}

export function isObjFolderOrParam(obj: any){
	if(
		obj &&
		obj.hasOwnProperty('val') &&
		obj.val !== undefined
	){
		return 'param'
	} else if(
		obj &&
		typeof obj === 'object' &&
		!obj.length
	){
		return 'folder'
	} else {
		return undefined
	}
}

export function rebuildFolder(obj){
	return Object.keys(obj).reduce((prev, key)=>{
		if(obj !== undefined && obj.hasOwnProperty(key)){
			const childObj = obj[key]
			switch (isObjFolderOrParam(childObj)){
				case 'param':
				// make copy
					prev[key] = Object.assign({},childObj)
					break
				case 'folder':
					prev[key] = rebuildFolder(childObj)
					break
				default: // primitive value: string or num...
					prev[key] = childObj
			}
		}
		return prev
	},{})
}

const MAP_VAL_TYPES = {
	'undefined': (): string => 'undefined',
	'boolean': (): string => 'boolean',
	'function': (): string => 'function',
	'symbol': (): string => 'symbol',
	'string': (): string => 'string',
	'number': (val: number): string => {
		switch (isFinite(val)) {
			case true: return 'number'
			case false: return 'number' // NaN, Infinity
		}
	},
	'object': (val: Object): string => {
		if(val === null) return 'null'
		switch (val.constructor) {
			case Array: return 'array'
			case Object: return 'object'
			case RegExp: return 'regexp'
			case Promise: return 'promise'
		}
		if(val instanceof String) return 'string' // typeof new String() === 'object'
		if(val instanceof Date) return 'date'
		if(val instanceof Error && typeof val.message !== 'undefined') return 'error'
	},
}

export function getValType(val: any): string {
	return MAP_VAL_TYPES[typeof val].call(null, val)
}

export function isObj(val: any): boolean {
	return getValType(val) === 'object'
}


/**
 * Purge object's own keys
 * @param {Object} obj - An object
 */
export function purgeOwnKeys(obj: Object, shouldDelete: boolean): void {
	let key: PropertyKey
	for (key in obj) { // purge own keys
		if (obj.hasOwnProperty(key)) {
			if (shouldDelete) { // delete ref and key...
				Reflect.deleteProperty(obj, key)
			} else { // release reference...
				obj[key] = undefined
			}
		}
	}
}