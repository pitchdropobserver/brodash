import { IPt, ILine } from './_interfaces'
import { isPtInBox } from './_geometry';

export function getDist2Pts(ptA: any, ptB: any ): number {
	return Array.isArray(ptA) ? 
		getDist2PtsArrFormat(ptA, ptB)
			: getDist2PtsObjFormat(ptA, ptB)
}

function getDist2PtsArrFormat(ptA: number[], ptB: number[]): number {
	return ptA.length === 3 ? (
		Math.sqrt(Math.pow(ptB[0] - ptA[0], 2) + Math.pow(ptB[1] - ptA[1], 2) + Math.pow(ptB[2] - ptA[2], 2))
	) : (
		Math.sqrt(Math.pow(ptB[0] - ptA[0], 2) + Math.pow(ptB[1] - ptA[1], 2))
	)
}

function getDist2PtsObjFormat(ptA: IPt, ptB: IPt): number {
	return ptA.z && ptB.z ? (
		Math.sqrt(Math.pow(ptB.x - ptA.x, 2) + Math.pow(ptB.y - ptA.y, 2) + Math.pow(ptB.z - ptA.z, 2))
	) : (
		Math.sqrt(Math.pow(ptB.x - ptA.x, 2) + Math.pow(ptB.y - ptA.y, 2))
	)
}

// total len between arr of pts
export function getLenArrPts(pts: IPt[]): number{
	const is3dLine: boolean = pts[0].z !== undefined
	let len: number = 0
	const reduceStart: IPt = {
		x:pts[0].x,
		y:pts[0].y,
	}
	if(is3dLine){
		reduceStart.z = pts[0].z
	}
	pts.reduce((prev: IPt, pt: IPt) => {
		if (prev.z && pt.z) { // if 3d point...
			len += Math.sqrt(
				Math.pow(pt.x - prev.x, 2)
				+ Math.pow(pt.y - prev.y, 2)
				+ Math.pow(pt.z - prev.z, 2)
			)
			prev.x = pt.x
			prev.y = pt.y
			prev.z = pt.z
		} else { // if 2d point...
			len += Math.sqrt(
				Math.pow(pt.x - prev.x, 2) 
				+ Math.pow(pt.y - prev.y, 2)
			)
			prev.x = pt.x
			prev.y = pt.y
		}
		return prev
	},reduceStart)
	return len
}


type ArrXY = {
	arrX: number[]
	arrY: number[]
}
type BoxParams = {
	pts: { [key: string]: IPt }
	edges: { [key: string]: ILine }
	width: number
	height: number
	origin: IPt
}
// give array of pts, get back bounding box obj
export function getBBoxFromPts(userArrPtsNd: any[]): BoxParams {

	let arrFlattened: IPt[]
	if(Array.isArray(userArrPtsNd[0])){ // if array of array
		arrFlattened = userArrPtsNd.flatMap(arr => arr)
	} else { // if already flattened
		arrFlattened = userArrPtsNd
	}

	const oArrXY = arrFlattened.reduce((prev: ArrXY, pt: IPt) => {
		prev.arrX.push(pt.x)
		prev.arrY.push(pt.y)
		return prev
	},{
		arrX:[], arrY:[]
	})
	// find min/max x/y
	Object.keys(oArrXY).forEach((xy: string) => {
		oArrXY[xy].sort((a: number, b: number) => a - b)
	})
	// calculate rect based on  min/max x/y
	const o: IPt = { x: oArrXY.arrX[0], y: oArrXY.arrY[0] }
	const w: number = Math.abs(oArrXY.arrX[oArrXY.arrX.length-1] - oArrXY.arrX[0])
	const h: number = Math.abs(oArrXY.arrY[oArrXY.arrY.length-1] - oArrXY.arrY[0])
	const pts = {
		//corner pts
		tl: {x:o.x, y:o.y},
		tr: {x:o.x + w, y:o.y},
		br: {x:o.x + w, y:o.y + h},
		bl: {x:o.x, y:o.y + h},
		// mid pts
		mt: {x:o.x + (o.x + w)/2, y:o.y},
		mr: {x:o.x + w, y:o.y + (o.y + h)/2},
		mb: {x:o.x + (o.x + w)/2, y:o.y + h},
		ml: {x:o.x, y:o.y + (o.y + h)/2},
		//center
		c: {x:o.x + w/2, y:o.y + h/2},
	}
	const lines = {
		t: {x1:pts.tl.x, y1:pts.tl.y, x2:pts.tr.x, y2:pts.tr.y},
		r: {x1:pts.tr.x, y1:pts.tr.y, x2:pts.br.x, y2:pts.br.y},
		b: {x1:pts.br.x, y1:pts.br.y, x2:pts.bl.x, y2:pts.bl.y},
		l: {x1:pts.bl.x, y1:pts.bl.y, x2:pts.tr.x, y2:pts.tr.y}
	}
	return {
		pts: pts,
		edges: lines,
		width: w,
		height: h,
		origin: o,
	}
}
