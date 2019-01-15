export function createPlaneOfPts(type, center, w, sideCount) {
	const gap = w / (sideCount - 1)
	const arrPts = []
	let origin
	switch (type) {
		case 'yz':
			origin = {
				x: center.x,
				y: center.y - w / 2,
				z: center.z - w / 2,
			}
			for (let i = 0; i < sideCount; i++) {
				for (let j = 0; j < sideCount; j++) {
					arrPts.push({
						x: origin.x,
						y: origin.y + gap * i,
						z: origin.z + gap * j,
					})
				}
			}
			break
		case 'xz':
			origin = {
				x: center.x - w / 2,
				y: center.y,
				z: center.z - w / 2,
			}
			for (let i = 0; i < sideCount; i++) {
				for (let j = 0; j < sideCount; j++) {
					arrPts.push({
						x: origin.x + gap * i,
						y: origin.y,
						z: origin.z + gap * j,
					})
				}
			}
			break
		case 'xy':
			origin = {
				x: center.x - w / 2,
				y: center.y - w / 2,
				z: center.z,
			}
			for (let i = 0; i < sideCount; i++) {
				for (let j = 0; j < sideCount; j++) {
					arrPts.push({
						x: origin.x + gap * i,
						y: origin.y + gap * j,
						z: origin.z,
					})
				}
			}
			break
	}
	return arrPts
}


export function isPtInBox(pt, box) {
	// console.log('box.range.x',box.range.x)
	// console.log('box.range.y',box.range.y)
	// console.log('box.range.z',box.range.z)
	if (pt.x >= box.range.x.min && pt.x <= box.range.x.max) {
		if (pt.y >= box.range.y.min && pt.y <= box.range.y.max) {
			if (pt.z >= box.range.z.min && pt.z <= box.range.z.max) {
				return true
			}
		}
	}
}


export function createCube(center, width, length, height) {

	const w = width
	const l = length ? length : width
	const h = height ? height : width

	const origin = {
		x: center.x - w / 2,
		y: center.y - l / 2,
		z: center.z - h / 2,
	}

	const bbl = { x: origin.x, y: origin.y, z: origin.z }  // bot: bl
	const bbr = { x: origin.x + w, y: origin.y, z: origin.z }  // bot: br
	const btr = { x: origin.x + w, y: origin.y + l, z: origin.z }  // bot: tr
	const ttr = { x: origin.x + w, y: origin.y + l, z: origin.z + h }  // top: tr
	const tbr = { x: origin.x + w, y: origin.y, z: origin.z + h }  // top: br
	const btl = { x: origin.x, y: origin.y + l, z: origin.z }  // bot: tl
	const ttl = { x: origin.x, y: origin.y + l, z: origin.z + h }  // top: tl
	const tbl = { x: origin.x, y: origin.y, z: origin.z + h }  // top: bl

	return {
		// counter clockwise from bottom-left, ie. origin.
		arrPts: [bbl, bbr, btr, btl, tbl, tbr, ttr, ttl],
		oEdges: {
			// lines in bottom plane
			bb: [bbl, bbr],
			br: [bbr, btr],
			bt: [btr, btl],
			bl: [btl, bbl],
			// lines in top plane
			tb: [tbl, tbr],
			tr: [tbr, ttr],
			tt: [ttr, ttl],
			tl: [ttl, tbl],
			// vertical lines
			vbl: [bbl, tbl],
			vbr: [bbr, tbr],
			vtr: [btr, ttr],
			vtl: [btl, ttl],
		},
		arrEdges: [
			[bbl, bbr], [bbr, btr], [btr, btl], [btl, bbl], // lines in bottom plane
			[tbl, tbr], [tbr, ttr], [ttr, ttl], [ttl, tbl], // lines in top plane
			[bbl, tbl], [bbr, tbr], [btr, ttr], [btl, ttl], // vertical lines
		],
		range: {
			x: { min: origin.x, max: origin.x + w },
			y: { min: origin.y, max: origin.y + l },
			z: { min: origin.z, max: origin.z + h },
		},
	}
}


export function createCubeOfPts(center, w, sideCount) {
	const arrCubePts = []
	const gap = w / (sideCount - 1)
	const origin = {
		x: center.x - w / 2,
		y: center.y - w / 2,
		z: center.z - w / 2,
	}
	for (let i = 0; i < sideCount; i++) {
		for (let j = 0; j < sideCount; j++) {
			for (let k = 0; k < sideCount; k++) {
				arrCubePts.push({
					x: origin.x + gap * i,
					y: origin.y + gap * j,
					z: origin.z + gap * k,
				})
			}
		}
	}
	return arrCubePts
}

export function ConstructorBezierCurve(pt0, pt1, pt2) {
	this.arrCtrlPts = [pt0, pt1, pt2],
		// console.log(pt0,pt1,pt2)
		this.getPtOnCrv = function (t) {
			return {
				x: (1 - t) * (1 - t) * pt0.x + 2 * (1 - t) * t * pt1.x + t * t * pt2.x,
				y: (1 - t) * (1 - t) * pt0.y + 2 * (1 - t) * t * pt1.y + t * t * pt2.y,
				z: (1 - t) * (1 - t) * pt0.z + 2 * (1 - t) * t * pt1.z + t * t * pt2.z,
			}
		}
}

export function xyzToArray(xyz) {
	if (Array.isArray(xyz)) {
		return xyz
	} else {
		if (xyz.x.hasOwnProperty('val')) {
			return [
				xyz.x.val,
				xyz.y.val,
				xyz.z.val,
			]
		} else {
			return [
				xyz.x,
				xyz.y,
				xyz.z,
			]
		}
	}
}
