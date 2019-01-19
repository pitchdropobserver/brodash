import {
	subVectors,
	normalizeVector,
	getVecLen,
	setScalar,
	addVectors,
} from './_vectors'

export function ptsOnSphere(numPts, radius){
    const arrPts = []
    const inc = Math.PI * (3 - Math.sqrt(5))
    const off = 2.0 / numPts
    let x, y, z, r, phi
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

export function subdivPlanarQuad(verts, numDivAxis1, numDivAxis2 ){
	const origin = verts[0]
	const axis1 = subVectors( verts[1], origin)
	const axis2 = subVectors( verts[3], origin)
	const uAxis1 = Object.assign({},axis1)
	normalizeVector(uAxis1)
	const uAxis2 = Object.assign({},axis2)
	normalizeVector(uAxis2)
	const stepLen1 = getVecLen(axis1)/numDivAxis1
	const stepLen2 = getVecLen(axis2)/numDivAxis2
	let v1, vStep1, vStep2, arrPts = []
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

export function divLineByLen(line,len){
	const lineIs3D = (line.z1 === undefined) ? false : true
	// divides line into eqidistance given len
	const lineLen = (lineIs3D)?
	Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2) + Math.pow(line.z2 - line.z1, 2))
	: Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2))

	const numPts = Math.ceil(lineLen / len) // must round up here
	const unitX = (line.x2 - line.x1) / numPts
	const unitY = (line.y2 - line.y1) / numPts
	const unitZ = (lineIs3D)? (line.z2 - line.z1) / numPts : 0

	const pts = []
	let pt
	for (let i = 0; i < numPts; i++){
		pt = (lineIs3D)? {
			x:line.x1 + unitX * i ,
			y:line.y1 + unitY * i ,
			z:line.z1 + unitZ * i ,
		} : {
			x:line.x1 + unitX * i ,
			y:line.y1 + unitY * i ,
		}
		pts.push(pt)
	}
	const lastPt = (lineIs3D)? {x:line.x2, y:line.y2, z:line.z2} : {x:line.x2, y:line.y2}
	pts.push(lastPt)
	return pts
}

/**
 * divide line into int segments, return arrPts
 *
 */
export function divLineByNumSeg(line, numSeg){
	let segX = (line.x2 - line.x1)/numSeg
	let segY = (line.y2 - line.y1)/numSeg

	let arrPts = [{x:line.x1, y:line.y1}]

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

export function divLineByNumNodes(line, numNodes){
	let segX = (line.x2 - line.x1)/(numNodes - 1)
	let segY = (line.y2 - line.y1)/(numNodes - 1)

	let arrPts = [{x:line.x1, y:line.y1}]

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
export function divLineEscalator(line, numSegOnLine, mostSegsXorY, outputFormat){
	const dx = (line.x2 - line.x1)
	const dy = (line.y2 - line.y1)
	const numSteps = (numSegOnLine + 1) * 0.5
	const numStepSeg = numSteps * 2  // 2 stepSegs make 1 step
	// delta btw halves = 0 when numSegOnLine is odd
	const smallerHalf = Math.floor(numStepSeg / 2)
	const biggerHalf = numStepSeg - smallerHalf

	let numStepX, numStepY, stepDx, stepDy, arrDxDy = []
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

export function divCircByNumSeg(center, radius, numPts, offset = 0){
	const arrTValues = findRangeValues(0, 2*Math.PI, numPts, offset)
	function findRangeValues(tFloor, tCeil, int, offset){
		let unit = (tCeil - tFloor) / int
		let arrTRange = [], val
		for (let i = 0; i < int; i ++){
			val = tFloor + offset + (unit * i)
			if(val > tCeil) val = val - tCeil // if overshoot ceiling, circle back
			arrTRange.push(val)
		}
		return arrTRange
	}
	// xy coordinate of pts in ring
	// xy coordinate of pts in ring
	return arrTValues.map(function(tValue){
		return {
			x: Math.cos(tValue) * radius + center.x,
			y: Math.sin(tValue) * radius + center.y,
		}
	})
}
