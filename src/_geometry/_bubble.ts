import { IPt } from '../interfaces'
import { calcSvgArcPath } from '../_svg'

type Edge = {
	dx: number
	dy: number
	theta: number
}

type ArcParam = {
	radius: number
	start: IPt
	end: IPt
}

type Node = {
	x: number
	y: number
	r: number
}

export function calcArcStart(cx: number, cy: number, prevEdge: Edge, bubbleArmPrev: Edge): IPt{
	let x, y
	if(
		prevEdge.dx >= 0 // +
		&& prevEdge.dy >= 0 // +
	){ // quadrant 1 (+/+)
		x = cx - bubbleArmPrev.dx
		y = cy + bubbleArmPrev.dy
	} else if(
		prevEdge.dx <= 0 // -
		&& prevEdge.dy >= 0 // +
	){ // quadrant 2 (-/+)
		x = cx - bubbleArmPrev.dx
		y = cy - bubbleArmPrev.dy
	} else if(
		prevEdge.dx <= 0 // -
		&& prevEdge.dy <= 0 // -
	){ // quadrant 3 (-/-)
		x = cx + bubbleArmPrev.dx
		y = cy - bubbleArmPrev.dy
	} else if(
		prevEdge.dx >= 0 // +
		&& prevEdge.dy <= 0 // -
	){ // quadrant 4 (+/-)
		x = cx + bubbleArmPrev.dx
		y = cy + bubbleArmPrev.dy
	}
	return { x, y }
}

export function calcArcEnd(cx: number, cy: number, nextEdge: Edge, bubbleArmNext: Edge): IPt {
	let x, y
	if(
		nextEdge.dx >= 0 // +
		&& nextEdge.dy >= 0 // +
	){ // quadrant 1 (+/+)
		x = cx + bubbleArmNext.dx
		y = cy - bubbleArmNext.dy
	} else if(
		nextEdge.dx <= 0 // -
		&& nextEdge.dy >= 0 // +
	){ // quadrant 2 (-/+)
		x = cx + bubbleArmNext.dx
		y = cy + bubbleArmNext.dy
	} else if(
		nextEdge.dx <= 0 // -
		&& nextEdge.dy <= 0 // -
	){ // quadrant 3 (-/-)
		x = cx - bubbleArmNext.dx
		y = cy + bubbleArmNext.dy
	} else if(
		nextEdge.dx >= 0 // +
		&& nextEdge.dy <= 0 // -
	){ // quadrant 4 (+/-)
		x = cx - bubbleArmNext.dx
		y = cy - bubbleArmNext.dy
	}
	return { x, y }
}

/**
 * SVG ARCS
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
 * node is an object with x, y, r
 */
export function calcBubbleArcParams(arrNodes: Array<Node>, offsetFromNodeRadius: number = 0): Array<ArcParam> | undefined {
	if(arrNodes.length < 2) return // do not render unless group have more than 2 noes as members...
	const arrBubbleArcParams: Array<ArcParam> =[]
	let prevNode: Node = arrNodes[0],
		thisNode: Node = arrNodes[0],
		nextNode: Node = arrNodes[0]
	for (let i = 0; i < arrNodes.length; i++) {
		// rotating assignment of indexes...
		if(arrNodes.length === 2){
			if(i === 0){ // first...
				prevNode = arrNodes[1]
				thisNode = arrNodes[0]
				nextNode = arrNodes[1]
			} else if(i === 1){ // last...
				prevNode = arrNodes[0]
				thisNode = arrNodes[1]
				nextNode = arrNodes[0]
			}
		} else if(arrNodes.length >= 3){
			if(i === 0){ // first...
				prevNode = arrNodes[arrNodes.length-1] // last as prev
				thisNode = arrNodes[i]
				nextNode = arrNodes[i+1]
			} else if(i === arrNodes.length-1){ // last...
				prevNode = arrNodes[i-1]
				thisNode = arrNodes[i]
				nextNode = arrNodes[0] // first as next
			} else { // middle...
				prevNode = arrNodes[i-1]
				thisNode = arrNodes[i]
				nextNode = arrNodes[i+1]
			}
		} 
		// console.log(`----------- ${i} -------------`)
		// console.log(prevNode, thisNode, nextNode )

		const prevEdge: Edge = { dx:0, dy:0, theta:0}
		prevEdge.dx = prevNode.x - thisNode.x
		prevEdge.dy = prevNode.y - thisNode.y
		prevEdge.theta = Math.atan(prevEdge.dy / prevEdge.dx)
		const nextEdge: Edge = { dx: 0, dy: 0, theta: 0 }
		nextEdge.dx = nextNode.x - thisNode.x
		nextEdge.dy = nextNode.y - thisNode.y
		nextEdge.theta = Math.atan(nextEdge.dy / nextEdge.dx)
		// console.log('nextEdge', nextEdge)
		// console.log('prevEdge', prevEdge)

		const bubbleArmLen = thisNode.r + offsetFromNodeRadius  // hypotenuse
		const bubbleArmPrev = { dx: 0, dy: 0, theta: 0 }
		bubbleArmPrev.theta = Math.PI/2 - Math.abs(prevEdge.theta)
		bubbleArmPrev.dx = Math.abs(Math.cos(bubbleArmPrev.theta) * bubbleArmLen)
		bubbleArmPrev.dy = Math.abs(Math.sin(bubbleArmPrev.theta) * bubbleArmLen)
		const bubbleArmNext = { dx:0, dy:0, theta:0 }
		bubbleArmNext.theta = Math.PI/2 - Math.abs(nextEdge.theta)
		bubbleArmNext.dx = Math.abs(Math.cos(bubbleArmNext.theta) * bubbleArmLen)
		bubbleArmNext.dy = Math.abs(Math.sin(bubbleArmNext.theta) * bubbleArmLen)
		// console.log('bubbleArmNext', bubbleArmNext)
		// console.log('bubbleArmPrev', bubbleArmPrev)
	
		arrBubbleArcParams.push({
			radius: bubbleArmLen,
			start: calcArcStart(thisNode.x, thisNode.y, prevEdge, bubbleArmPrev),
			end: calcArcEnd(thisNode.x, thisNode.y, nextEdge, bubbleArmNext),
		})
	}
	return arrBubbleArcParams
}

export function calcBubbleSvgPath(arrBubbleArcParams: Array<ArcParam>): string {
	let strSvgPath: string = '',
		thisArc: ArcParam,
		nextArc: ArcParam
	// loop through all nodes again, construct arc path based on calculated param
	for (let i = 0; i < arrBubbleArcParams.length; i++) {
		thisArc = arrBubbleArcParams[i]
		if(i === arrBubbleArcParams.length-1){ // at end...
			nextArc = arrBubbleArcParams[0] // loop back to beginning
		} else { // start & middle...
			nextArc = arrBubbleArcParams[i+1]
		}

		strSvgPath += calcSvgArcPath(
			thisArc.start, thisArc.end, thisArc.radius, i === 0
		)

		// line to next start of next arc
		strSvgPath += [
			'L',
			nextArc.start.x,
			nextArc.start.y,
		].join(' ')
	}
	return strSvgPath
}


export function getBubbleSvgPathFromPts(arrNodes: Node[], offsetFromNodeRadius: number): string | undefined {
	const arrArcParams = calcBubbleArcParams(arrNodes, offsetFromNodeRadius)
	if (arrArcParams !== undefined){
		return calcBubbleSvgPath(arrArcParams)
	}
}
