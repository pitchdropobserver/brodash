import {
	XMLNS_SVG,
} from '../_constants'
import {
	IPt,
} from '../_interfaces'

export function createSvgArrowShapePath(w: number, h: number): string {
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

export function createSvgElement(tag: string, parentDom: HTMLElement): Element {
	const elem: Element = document.createElementNS(XMLNS_SVG, tag)
	parentDom.appendChild(elem)
	return elem
}

/**
 * Convert a svg points string to an array of values
 * @param {string} pointsAttr - Array of string
 * @return {Array} - Array of numeric values 
 */
export function plinePtConvert(pointsAttr: string| string[]): number[]|string[]|undefined {
	if (Array.isArray(pointsAttr)) return pointsAttr
	if (typeof pointsAttr === 'string') {
		return pointsAttr.split(/[\s,]+/).map(str => Number(str))
	}
}


export function calcSvgArcPath(start: IPt, end: IPt, radius: number, withStart:boolean = true): string {
	let strSvgPath = ''
	if (withStart) {
		// move pen to arc start
		strSvgPath += [
			'M',
			start.x,
			start.y,
		].join(' ')
	}
	// arc path
	strSvgPath += [
		'A', // A
		radius, // rx -> arc radius x
		radius, // ry -> arc radius y
		0, // x-axis-rotation
		0, // large-arc-flag
		1, // sweep-flag
		end.x, // x -> arc end x
		end.y, // y -> arc end y
	].join(' ')
	return strSvgPath
}


/**
 * Convert an array of pts into a svg points attribute string
 * @param {Array} pts - Array of points with x, y keys
 * @return {string} - A svg points attribute string eg. "10,20 50,60"
 */
export function arrPtsToSvgPointsAttr(pts: Array<IPt>): string {
	return pts.map(pt => pt.x + ',' + pt.y).join(' ')
}