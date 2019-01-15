export function getDist2Pts(ptA,ptB){
	if(ptA.hasOwnProperty('length')){ // array format
		switch (ptA.length) {
			case 2: return Math.sqrt(Math.pow(ptB[0] - ptA[0], 2) + Math.pow(ptB[1] - ptA[1], 2))
			case 3: return Math.sqrt(Math.pow(ptB[0] - ptA[0], 2) + Math.pow(ptB[1] - ptA[1], 2) + Math.pow(ptB[2] - ptA[2], 2))
				break
		}
	} else { // object format
		if(ptA.z) {
			return Math.sqrt(Math.pow(ptB.x - ptA.x, 2) + Math.pow(ptB.y - ptA.y, 2) + Math.pow(ptB.z - ptA.z, 2))
		} else {
			return Math.sqrt(Math.pow(ptB.x - ptA.x, 2) + Math.pow(ptB.y - ptA.y, 2))
		}
	}
}

// total len between arr of pts
export function getLenArrPts(pts){
	const lineIs3D = (pts[0].z === undefined) ? false : true
	const reduceStart = {
		x:pts[0].x,
		y:pts[0].y,
		len:0,
	}
	if(lineIs3D){
		reduceStart.z = pts[0].z
	}

	return pts.reduce(function(prev, pt){
		prev.len += Math.sqrt(Math.pow(pt.x - prev.x, 2) + Math.pow(pt.y - prev.y, 2))
		prev.x = pt.x
		prev.y = pt.y
		if(lineIs3D){
			prev.z = pt.z
		}
		return prev
	},reduceStart).len
}

// give array of pts, get back bounding box obj
export function getBBoxFromPts(userArrPtsNd){

	let arrFlattened
	if(Array.isArray(userArrPtsNd[0])){
		arrFlattened = userArrPtsNd.reduce(function(prev, arr){
			prev = prev.concat(arr)
			return prev
		},[])
	} else {
		arrFlattened = userArrPtsNd
	}

	let oArrXY =
	arrFlattened.reduce(function(prev, pt){
		prev.arrX.push(pt.x)
		prev.arrY.push(pt.y)
		return prev
	},{arrX:[], arrY:[]})
	// find min/max x/y
	Object.keys(oArrXY).map(function(xy){
		oArrXY[xy].sort(function(a,b){
			return a - b
		})
	})
	// calculate rect based on  min/max x/y
	let o = {x:oArrXY.arrX[0], y:oArrXY.arrY[0]}
	let w = Math.abs(oArrXY.arrX[oArrXY.arrX.length-1] - oArrXY.arrX[0])
	let h = Math.abs(oArrXY.arrY[oArrXY.arrY.length-1] - oArrXY.arrY[0])
	let pts = {
		//corner pts
		tl:{x:o.x, y:o.y},
		tr:{x:o.x + w, y:o.y},
		br:{x:o.x + w, y:o.y + h},
		bl:{x:o.x, y:o.y + h},
		// mid pts
		mt:{x:o.x + (o.x + w)/2, y:o.y},
		mr:{x:o.x + w, y:o.y + (o.y + h)/2},
		mb:{x:o.x + (o.x + w)/2, y:o.y + h},
		ml:{x:o.x, y:o.y + (o.y + h)/2},
		//center
		c:{x:o.x + w/2, y:o.y + h/2},
	}
	let lines = {
		t:{x1:pts.tl.x, y1:pts.tl.y, x2:pts.tr.x, y2:pts.tr.y},
		r:{x1:pts.tr.x, y1:pts.tr.y, x2:pts.br.x, y2:pts.br.y},
		b:{x1:pts.br.x, y1:pts.br.y, x2:pts.bl.x, y2:pts.bl.y},
		l:{x1:pts.bl.x, y1:pts.bl.y, x2:pts.tr.x, y2:pts.tr.y}
	}
	return {
		pts:pts,
		edges:lines,
		width:w,
		height:h,
		origin:o,
	}
}
