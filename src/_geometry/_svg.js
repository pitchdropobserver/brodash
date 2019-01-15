import {
	XMLNS_SVG,
} from '../_constants'

export function createSvgArrowShapePath(w, h){
	const pts = [
		{x:0, y:0},
		{x:w, y:h/2},
		{x:0, y:h}
	]
	return [
		'M', pts[0].x, pts[0].y,
		'L', pts[1].x, pts[1].y,
		'L', pts[2].x, pts[2].y,
		'Z'
	].join(' ')
}

export function createSvgElement(tag, parentDom){
	const elem = document.createElementNS(XMLNS_SVG, tag)
	parentDom.appendChild(elem)
	return elem
}
