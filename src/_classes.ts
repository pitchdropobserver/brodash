export class CustomList {
	each(callback: Function){
		let key: string, index: number = 0
		for (key in this) {
			if (this.hasOwnProperty(key)) {
				callback(this[key], key, index++)
			}
		}
	}
}

export class Copiable {
	constructor(obj: Object){
		Object.assign(this, obj)
	}
	copy(){
		return Object.assign({}, this, ...arguments)
	}
}



type Handler = (obj: any, key: string | number | symbol, val: any) => void
/**
 * An object with 'set' operation trapped to force set value into array form, with the exception of 'undefined'.
 * @return {object} a proxy object
 */
export class ArrayOnlyObject{
	constructor(){
		new Proxy(this, {
			set(target, key: PropertyKey, value: any): boolean {
				if(
					Array.isArray(value)
					|| value === undefined // if to release value
				){
					target[key] = value
					return true
				} else {
					target[key] = [ value ] // always store as array
					return true
				}
			}
		})
	}
}
