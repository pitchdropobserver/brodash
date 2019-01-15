import { divLineByNumSeg, divLineEscalator } from './_subdivision'

/* accomodates array/obj format
 * accomodates 2D/3D format
 */
export function getMidPt(ptA, ptB){
	if(ptA.hasOwnProperty('length')){ // array format
		if (ptA.length === 3){
			return [
				ptA[0] + (ptB[0] - ptA[0]),
				ptA[1] + (ptB[1] - ptA[1]),
				ptA[2] + (ptB[2] - ptA[2])
			]
		} else {
			return [
				ptA[0] + (ptB[0] - ptA[0]),
				ptA[1] + (ptB[1] - ptA[1])
			]
		}
	} else { // object format
		if (ptA.hasOwnProperty('z')){
			return {
				x:ptA.x + (ptB.x - ptA.x),
				y:ptA.y + (ptB.y - ptA.y),
				z:ptA.z + (ptB.z - ptA.z)
			}
		} else {
			return {
				x:ptA.x + (ptB.x - ptA.x),
				y:ptA.y + (ptB.y - ptA.y)
			}
		}
	}
}

// normalize vec2 to specified scale
export function normalize(pt, scale) {
	let norm = Math.sqrt(pt.x * pt.x + pt.y * pt.y)
	if (norm != 0) { // as3 return 0,0 for a point of zero length
		return {
			x: scale * pt.x / norm,
			y: scale * pt.y / norm,
		}
	}
}

export function transformerLinearDiv3(line){
	return divLineByNumSeg(line,3)
}

export function transformerEscalator(line){
	return divLineEscalator(line, 2, 'y')
}

export function transformerMsgBus(line){
	const tolerance = 0.01
	const clusterCenter = line.clusterCenter
	if (Math.abs(line.x2 - line.x1) <= tolerance){
		// if line is vertical
		return [
			{x:line.x1, y:line.y1},
			{x:line.x2, y:line.y2},
		]
	} else {
		// if line is diagonal or horizontal (connecting to node to your side, with in a group)
		return [
			{x:line.x1, y:line.y1},
			{x:line.x1, y:clusterCenter.y},
			{x:line.x2, y:clusterCenter.y},
			{x:line.x2, y:line.y2},
		]
	}
}

export function transformerIexCoil(op){ // center-aligned coil
	const line = op.line // TODO: change all other transformers into accepting option obj
	const arrPctSegments = op.arrPctSegments // arr of pct taken up by each segment, middle seg is coil
	const pctCoilH = op.pctCoilH
	const numCoilPeaks = op.numCoilPeaks

	const dx = line.x2 - line.x1
	const arrBasePts = arrPctSegments.reduce(function(prev, pct, index){
		const pt = {
			x:prev[index].x + pct * dx,
			y:line.y1,
		}
		prev.push(pt)
		return prev
	},[{
		x:line.x1,
		y:line.y1
	}])
	// coil coordinates
	const ptCoilStart = arrBasePts[1]
	const numCoilPtsAll = numCoilPeaks * 2
	const arrCoilPts = []
	const coilPtsAllDx = dx * arrPctSegments[1] / (numCoilPtsAll + 1)

	for (let i = 0; i < numCoilPtsAll; i++) {
		let peak = (i % 2 === 0) ? 1 : -1
		arrCoilPts.push({
			x: ptCoilStart.x + coilPtsAllDx * (i+1),
			y: line.y1 + dx * pctCoilH * peak,
		})
	}
	arrBasePts.splice(2,0,...arrCoilPts)
	return arrBasePts
}

export function transformerIexCoilBaseAligned(line){
	const dx = line.x2 - line.x1
	const arrPctSegments = [0.2,0.3,0.5]  // arr of pct taken up by each segment, middle seg is coil

	const arrBasePts = arrPctSegments.reduce(function(prev, pct, index){
		const pt = {
			x:prev[index].x + pct * dx,
			y:line.y1,
		}
		prev.push(pt)
		return prev
	},[{
		x:line.x1,
		y:line.y1
	}])
	// coil coordinates
	const ptCoilStart = arrBasePts[1]
	const pctCoilH = 0.3
	const numCoilPeaks = 4
	const numCoilPtsAll = numCoilPeaks * 2 - 1
	const arrCoilPts = []
	const coilPtsAllDx = dx * arrPctSegments[1] / numCoilPtsAll

	for (let i = 0; i < numCoilPtsAll; i++) {
		let peak = (i % 2 === 0) ? 1 : 0
		arrCoilPts.push({
			x: ptCoilStart.x + coilPtsAllDx * (i+1),
			y: line.y1 + dx * pctCoilH * peak,
		})
	}
	arrBasePts.splice(2,0,...arrCoilPts)
	return arrBasePts
}

export function transformerDiagonalConnectorConstructor (bool){
	// whether diagonal connects into start or end pt
	const angleAtStart = bool

	return function fnTransformerDiagonalConnector(line){
		// compare dx, dy to detemrine connector orientation
		const dx = line.x2 - line.x1
		const dy = line.y2 - line.y1

		const midpoint = {x:null, y:null}
		if(Math.abs(dy) > Math.abs(dx)){ // up right
			if(angleAtStart){ // angle connects into start
				midpoint.x = line.x2
				midpoint.y = (dy <= 0) ? line.y1 -  Math.abs(dx) : line.y1 + Math.abs(dx)
			} else { // angle connects into end
				midpoint.x = line.x1
				midpoint.y = (dy <= 0) ? line.y1 - (Math.abs(dy) - Math.abs(dx)) : line.y1 + (Math.abs(dy) - Math.abs(dx))
			}
		} else { // horizontal
			if(angleAtStart){ // angle connects into start
				midpoint.y = line.y2
				midpoint.x = (dx >= 0) ? line.x1 + Math.abs(dy) : line.x1 - Math.abs(dy)
			} else { // angle connects into end
				midpoint.y = line.y1
				midpoint.x = (dx >= 0) ? line.x1 + (Math.abs(dx) - Math.abs(dy)) : line.x1 - (Math.abs(dx) - Math.abs(dy))
			}
		}
		return [
			{x:line.x1, y:line.y1},
			midpoint,
			{x:line.x2, y:line.y2},
		]
	}
}

export function transformerNone(line){
	return [
		{x:line.x1, y:line.y1},
		{x:line.x2, y:line.y2},
	]
}

export function getVecLen(v3) {
	return Math.sqrt( v3.x*v3.x + v3.y*v3.y + v3.z*v3.z )
}

export function setScalar(v3, len) {
	normalizeVector(v3)
	v3.x *= len
	v3.y *= len
	v3.z *= len
}

export function normalizeVector(v3) {
	const vLen = getVecLen(v3)
	v3.x /= vLen
	v3.y /= vLen
	v3.z /= vLen
}

export function subVectors(a, b) {
	return {
		x:a.x - b.x,
		y:a.y - b.y,
		z:a.z - b.z,
	}
}

export function addVectors(a, b) {
	return {
		x:a.x + b.x,
		y:a.y + b.y,
		z:a.z + b.z,
	}
}

/**
 * Cross product of two vectors
 * @param {vector} a - obj or arr
 * @param {vector} b - obj or arr
 */
export function crossVectors(a, b) {
	if(a.hasOwnProperty('length')){
		return [
			a[1] * b[2] - a[2] * b[1],
			a[2] * b[0] - a[0] * b[2],
			a[0] * b[1] - a[1] * b[0],
		]
	}
	if(a.hasOwnProperty('z')){
		return [
			a.y * b.z - a.z * b.y,
			a.z * b.x - a.x * b.z,
			a.x * b.y - a.y * b.x,
		]
	}
}
