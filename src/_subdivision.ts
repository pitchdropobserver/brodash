import { IPt, IVec3d, ILine } from './_interfaces'
import {
	subVectors,
	normalizeVector,
	getVecLen,
	setScalar,
	addVectors,
} from './_vectors'

export function ptsOnSphere(numPts: number, radius: number): IPt[] {
	const arrPts: IPt[] = []
	const inc: number = Math.PI * (3 - Math.sqrt(5))
	const off: number = 2.0 / numPts
	let x: number, y: number, z: number, r: number, phi: number
	for (let k = 0; k < numPts; k++){
		y = k * off - 1 + (off / 2)
		r = Math.sqrt(1 - y * y)
		phi = k * inc
		x = Math.cos(phi) * r
		z = Math.sin(phi) * r
		arrPts.push({
			x: x * radius * 2,
			y: y * radius * 2,
			z: z * radius * 2,
		})
	}
	return arrPts
}

export function subdivPlanarQuad(verts: IVec3d[], numDivAxis1: number, numDivAxis2: number): IVec3d[] {
	const origin: IVec3d = verts[0]
	const axis1: IVec3d = subVectors( verts[1], origin)
	const axis2: IVec3d = subVectors( verts[3], origin)
	const uAxis1: IVec3d = Object.assign({},axis1)
	normalizeVector(uAxis1)
	const uAxis2: IVec3d = Object.assign({},axis2)
	normalizeVector(uAxis2)
	const stepLen1: number = getVecLen(axis1) / numDivAxis1
	const stepLen2: number = getVecLen(axis2) / numDivAxis2
	const arrPts: IVec3d[] = []
	let v1: IVec3d, vStep1: IVec3d, vStep2: IVec3d
	for (let i = 0; i <= numDivAxis1; i++) {
		vStep1 = Object.assign({},uAxis1)
		setScalar(vStep1, stepLen1 * i)
		v1 = addVectors( origin, vStep1 )
		for (let j = 0; j <= numDivAxis2; j++) {
			vStep2 = Object.assign({},uAxis2)
			setScalar(vStep2, stepLen2 * j)
			arrPts.push(
				addVectors(
					v1, vStep2
				)
			)
		}
	}
	return arrPts
}

export function divLineByLen(line: ILine, len: number): IPt[] {
	const is3dLine: boolean = line.z1 !== undefined
	// divides line into eqidistance given len
	const lineLen: number = is3dLine ?
	Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2) + Math.pow(line.z2 - line.z1, 2))
	: Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2))

	const numPts: number = Math.ceil(lineLen / len) // must round up here
	const unitX: number = (line.x2 - line.x1) / numPts
	const unitY: number = (line.y2 - line.y1) / numPts
	const unitZ: number = (is3dLine)? (line.z2 - line.z1) / numPts : 0

	const arrPts: IPt[] = []
	let pt: IPt
	for (let i = 0; i < numPts; i++){
		pt = (is3dLine)? {
			x:line.x1 + unitX * i ,
			y:line.y1 + unitY * i ,
			z:line.z1 + unitZ * i ,
		} : {
			x:line.x1 + unitX * i ,
			y:line.y1 + unitY * i ,
		}
		arrPts.push(pt)
	}
	const lastPt: IPt = is3dLine ? {x:line.x2, y:line.y2, z:line.z2} : {x:line.x2, y:line.y2}
	arrPts.push(lastPt)
	return arrPts
}

/**
 * divide line into int segments, return array of points
 */
export function divLineByNumSeg(line: ILine, numSeg: number): IPt[] {
	const segX: number = (line.x2 - line.x1) / numSeg
	const segY: number = (line.y2 - line.y1) / numSeg
	const arrPts: IPt[] = [{ x:line.x1, y:line.y1 }]
	for (let i = 1; i < numSeg; i++){
		arrPts.push({
			x:line.x1 + segX * i,
			y:line.y1 + segY * i
		})
	}
	arrPts.push({
		x:line.x2,
		y:line.y2
	})
	return arrPts
}

export function divLineByNumNodes(line: ILine, numNodes: number): IPt[] {
	const segX: number = (line.x2 - line.x1) / (numNodes - 1)
	const segY: number = (line.y2 - line.y1) / (numNodes - 1)
	const arrPts: IPt[] = [{ x:line.x1, y:line.y1 }]
	for (let i = 1; i < numNodes-1; i++){
		arrPts.push({
			x:line.x1 + segX * i,
			y:line.y1 + segY * i
		})
	}
	arrPts.push({
		x:line.x2,
		y:line.y2
	})
	return arrPts
}

/**
 * divide line into int segments, return arrPts
 * divide line (x1,y1,x2,y2) into a path of zig zag (arr of pts)
 * step:seg -> 0.0:1 -> 1.5:2 -> 2.0:3 -> 2.5:4 -> 3.0:5
 * numSteps = (numSegOnLine + 1) * 0.5
 * numSegOnLine = numSteps / 2 + 0.5
 * stepSeg = numSegOnLine + 1 OR numSteps * 2
 */
export function divLineEscalator(line: ILine, numSegOnLine: number, mostSegsXorY: string, outputFormat?: string): number[][] | IPt[] | string {
	const dx: number = line.x2 - line.x1
	const dy: number = line.y2 - line.y1
	const numSteps: number = (numSegOnLine + 1) * 0.5
	const numStepSeg: number = numSteps * 2  // 2 stepSegs make 1 step
	// delta btw halves = 0 when numSegOnLine is odd
	const smallerHalf: number = Math.floor(numStepSeg / 2)
	const biggerHalf: number = numStepSeg - smallerHalf

	let numStepX: number, numStepY: number, stepDx: number, stepDy: number, arrDxDy: IPt[] = []
	// most step segs along x or y axis?
	switch(mostSegsXorY){
		case 'x':
			numStepX = biggerHalf
			numStepY = smallerHalf
			// calc step seg len based on assigned num segs
			stepDx = dx / numStepX,
			stepDy = dy / numStepY
			// weave seg vec2 for x, y into array of vec2
			for (let i = 1; i <= numStepX; i++) {
				arrDxDy.push({x:stepDx, y:0})
				if(i <= numStepY){arrDxDy.push({x:0, y:stepDy}) }
			}
			break
		case 'y':
			numStepX = smallerHalf
			numStepY = biggerHalf
			stepDx = dx / numStepX,
			stepDy = dy / numStepY
			for (let i = 1; i <= numStepY; i++) {
				arrDxDy.push({x:0, y:stepDy})
				if(i <= numStepY){arrDxDy.push({x:stepDx, y:0}) }
			}
			break
	}

	if(outputFormat === 'svg-pline-format'){ // svg pline string format...
		const arrPts = [[line.x1, line.y1]]
		arrDxDy.reduce(function(prev, dxdy, index){
			prev.push([
				prev[index][0] + dxdy.x,
				prev[index][1] + dxdy.y,
			])
			return prev
		}, arrPts)
		//use actual end pts instead calculated end pts
		arrPts.pop()
		arrPts.push([line.x2, line.y2])
		return arrPts.map(function(pt){
			return pt.join(',')
		}).join(' ')

	} else if(outputFormat === 'array-format'){  // array of pts in array format...
		const arrPts = [[line.x1, line.y1]]
		arrDxDy.reduce(function(prev, dxdy, index){
			prev.push([
				prev[index][0] + dxdy.x,
				prev[index][1] + dxdy.y,
			])
			return prev
		}, arrPts)
		//use actual end pts instead calculated end pts
		arrPts.pop()
		arrPts.push([line.x2, line.y2])
		return arrPts
	} else { // array of pts in obj format...
		// apply array of vec2
		const arrPtObjs = [{x:line.x1, y:line.y1}]
		arrDxDy.reduce(function(prev, dxdy, index){
			prev.push({
				x:prev[index].x + dxdy.x,
				y:prev[index].y + dxdy.y,
			})
			return prev
		}, arrPtObjs)
		//use actual end pts instead calculated end pts
		arrPtObjs.pop()
		arrPtObjs.push({x:line.x2, y:line.y2})
		return arrPtObjs
	}
}

export function divCircByNumSeg(center: IPt, radius: number, numPts: number, offset: number = 0): IPt[] {
	const arrTValues = findRangeValues(0, 2 * Math.PI, numPts, offset)
	// xy coordinate of pts in ring
	return arrTValues.map( tValue => ({
		x: Math.cos(tValue) * radius + center.x,
		y: Math.sin(tValue) * radius + center.y,
	}))
}

export function findRangeValues(tFloor: number, tCeil: number, int: number, offset: number): number[] {
	const unit: number = (tCeil - tFloor) / int
	const arrTRange: number[] = []
	let val: number
	for (let i = 0; i < int; i++) {
		val = tFloor + offset + (unit * i)
		if (val > tCeil) val = val - tCeil // if overshoot ceiling, circle back
		arrTRange.push(val)
	}
	return arrTRange
}