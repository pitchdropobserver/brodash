export class CustomList {
	constructor(){
	}
	each(callback){
		let key, index = 0
		for (key in this) {
			if (this.hasOwnProperty(key)) {
				callback(this[key], key, index++)
			}
		}
	}
}

export class Copiable {
	constructor(object){
		Object.assign(this, object)
	}
	copy(){
		return Object.assign({}, this, ...arguments)
	}
}



/**
 * An object with 'set' operation trapped to force set value into array form, with the exception of 'undefined'.
 * @return {object} - a proxy object
 */
export class ArrayOnlyObject {
	constructor(){
		new Proxy(this, {
			set:(obj, key, val) => {
				if(
					val === undefined
					|| Array.isArray(val)
				){
					obj[key] = val
				} else {
					obj[key] = [ val ] // always store as array
				}
			}
		})
	}
}
