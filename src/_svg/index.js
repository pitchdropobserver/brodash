import {
	XMLNS_SVG,
} from '../_constants'

export function createSvgArrowShapePath(w, h) {
	const pts = [
		{ x: 0, y: 0 },
		{ x: w, y: h / 2 },
		{ x: 0, y: h }
	]
	return [
		'M', pts[0].x, pts[0].y,
		'L', pts[1].x, pts[1].y,
		'L', pts[2].x, pts[2].y,
		'Z'
	].join(' ')
}

export function createSvgElement(tag, parentDom) {
	const elem = document.createElementNS(XMLNS_SVG, tag)
	parentDom.appendChild(elem)
	return elem
}


/**
 * Convert a svg points string to an array of values
 * @param {string} pointsAttr - Array of string
 * @return {Array} - Array of numeric values 
 */
export function plinePtConvert(pointsAttr) {
	if (Array.isArray(pointsAttr)) return pointsAttr
	if (typeof pointsAttr === 'string') {
		return pointsAttr.split(/[\s,]+/).map(str => Number(str))
	}
}