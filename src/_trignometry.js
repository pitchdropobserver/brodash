/**
* Cosine Law
* @param {number} a - length of adjacent side
* @param {number} b - length of adjacent side
* @param {number} C - theta btw a, b
* @returns {radian} - length of opposite side
*/
export function cosineLaw(a, b, C){
	return Math.sqrt(a*a + b*b - 2*a*b*Math.cos(C))
}

/**
 * Inverse Cosine Law
 * @param {number} a - length of adjacent side
 * @param {number} b - length of adjacent side
 * @param {number} c - length of opposite side
 * @returns {radian} - angle btw a, b
 */
export function cosineLawInverse(a,b,c){
	return Math.acos((a*a + b*b - c*c)/(2*a*b))
}
