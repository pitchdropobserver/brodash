 

export const schemaTHREEBoxGeo = {
	top:{
		triFaceIndexes:[8,9],
		vertIndexes:[0,5,7,2],
	},
	bot:{
		triFaceIndexes:[10,11],
		vertIndexes:[3,6,4,1],
	},
	left:{
		triFaceIndexes:[2,3],
		vertIndexes:[7,5,4,6],
	},
	right:{
		triFaceIndexes:[0,1],
		vertIndexes:[0,2,3,1],
	},
	front:{
		triFaceIndexes:[6,7],
		vertIndexes:[2,7,6,3],
	},
	back:{
		triFaceIndexes:[4,5],
		vertIndexes:[5,0,1,4],
	},
}

export function mapTHREEBoxGeoVertToQuads(verts){
	// per face, vertices are ordered via order of trignometry quadrants, ie. counterclockwise from top right corner
	return Object.keys(schemaTHREEBoxGeo).reduce(function(prev, faceName){
		prev[faceName] = schemaTHREEBoxGeo[faceName].vertIndexes.map(function(index){
			return verts[index]
		})
		return prev
	},{})
	// return {
	// 	top:[ verts[0], verts[5], verts[7], verts[2] ],
	// 	bot:[ verts[3], verts[6], verts[4], verts[1] ],
	// 	left:[ verts[7], verts[5], verts[4], verts[6] ],
	// 	right:[ verts[0], verts[2], verts[3], verts[1] ],
	// 	front:[ verts[2], verts[7], verts[6], verts[3] ],
	// 	back:[ verts[5], verts[0], verts[1], verts[4] ],
	// }
}

export function tempToTHREEMat(template){
	const THREEparam = Object.keys(template.param).reduce(function(prevParam, paramKey) {
		const templateParam = template.param[paramKey]
		if(templateParam.hasOwnProperty('val')){ // templateParam -> object
			switch (paramKey) {
				case 'color':
					prevParam[paramKey] = parseInt(templateParam.val, 16)
					break
				default:
					prevParam[paramKey] = templateParam.val
			}
		} else { // templateParam -> value
			if(
				paramKey === 'side' ||
				paramKey === 'shading'
			){
				// ie. 'DoubleSide' --> THREE.DoubleSide
				prevParam[paramKey] = THREE[templateParam]
			} else if(paramKey === 'color'){
				prevParam[paramKey] = parseInt(templateParam,16)
			} else {
				prevParam[paramKey] = templateParam
			}
		}
		return prevParam
	},{})
	return new THREE[template.THREEMaterialType](THREEparam)
}

export function createPointHelper(optn){
	const { scene, pos, ptSize } = optn
	const sphere = new THREE.Mesh(
		new THREE.SphereGeometry( ptSize, 10, 10 ),
		new THREE.MeshBasicMaterial({color: 0xffff00})
	)
	sphere.position.set(...pos)
	scene.add( sphere )
	return sphere
}


export function getRandBaryCoordWeighting(){
	let t1 = Math.random(),
 		t2 = Math.random(),
		t3
	if(t1 + t2 > 1){
		t1 = 1 - t1
		t2 = 1 - t2
	}
	t3 = 1 - t1 - t2
	return [t1, t2, t3]
}

function _getPtOnTriOrQuadFace(arrTHREEGeoVerts, arrVertIndex, type, triOrQuadFace){
	const wVec3 = new THREE.Vector3()
	const hVec3 = new THREE.Vector3()
	const ptRef = arrTHREEGeoVerts[arrVertIndex[0]]
	let wUnitLen, hUnitLen, baryVals
	switch (triOrQuadFace) {
		case 'quad':
			wVec3.subVectors(arrTHREEGeoVerts[arrVertIndex[1]], ptRef)
			hVec3.subVectors(arrTHREEGeoVerts[arrVertIndex[3]], ptRef)
			switch (type) {
				case 'random':
					wUnitLen = wVec3.length() * Math.random()
					hUnitLen = hVec3.length() * Math.random()
					break
				case 'center':
					wUnitLen = wVec3.length() * 0.5
					hUnitLen = hVec3.length() * 0.5
					break
			}
			break
		case 'tri':
			wVec3.subVectors(arrTHREEGeoVerts[arrVertIndex[1]], ptRef)
			hVec3.subVectors(arrTHREEGeoVerts[arrVertIndex[2]], ptRef)
			switch (type) {
				case 'random':
					baryVals = getRandBaryCoordWeighting()
					wUnitLen = wVec3.length() * baryVals[0]
					hUnitLen = hVec3.length() * baryVals[1]
					break
				case 'center':
					wUnitLen = wVec3.length() * 0.3333
					hUnitLen = hVec3.length() * 0.3333
					break
			}
			break
	}

	const whVec3 = new THREE.Vector3().addVectors(
		wVec3.setLength(wUnitLen),
		hVec3.setLength(hUnitLen)
	)
	return new THREE.Vector3().addVectors( ptRef, whVec3 )
}

export function getPtOnQuad(){
	return _getPtOnTriOrQuadFace(...arguments, 'quad')
}

export function getPtOnTriFace(){
	return _getPtOnTriOrQuadFace(...arguments, 'tri')
}

// only works with even subdivision
export function subdivTriangularSrfEven(arrVec3, divCount){

	const wVec3 = new THREE.Vector3()
	const hVec3 = new THREE.Vector3()
	const ptRef = arrVec3[0]
	wVec3.subVectors(arrVec3[1], ptRef)
	hVec3.subVectors(arrVec3[2], ptRef)

	const wUnitLen = wVec3.length()/divCount
	const hUnitLen = hVec3.length()/divCount
	// const wUnitVec3 = wVec3.clone().setLength(wUnitLen)
	// const hUnitVec3 = hVec3.clone().setLength(hUnitLen)

	let vec3, whVec3 = new THREE.Vector3()
	const arrVec3Subdiv = []
	for (let h = 0; h <= divCount; h++) {
		for (let w = 0; w <= divCount; w++) {
			if(w <= divCount - h){
				vec3 = new THREE.Vector3()
				whVec3.addVectors(
					wVec3.clone().setLength(wUnitLen * w),
					hVec3.clone().setLength(wUnitLen * h),
				)
				vec3.addVectors(
					ptRef,
					whVec3,
				)
				arrVec3Subdiv.push(vec3)
			}
		}
	}

	return arrVec3Subdiv
}

export function jitterXY(vec3, jitterAmount){
	vec3.x += Math.random() * jitterAmount * 2 - jitterAmount
	vec3.y += Math.random() * jitterAmount * 2 - jitterAmount
}

export function jitterXYZ(vec3, jitterAmount){
	vec3.x += Math.random() * jitterAmount * 2 - jitterAmount
	vec3.y += Math.random() * jitterAmount * 2 - jitterAmount
	vec3.z += Math.random() * jitterAmount * 2 - jitterAmount
}

// get middle of 2 pts, taking into consideration of travel distance remaining before reaching current destination
export function getCollisonPt(pt1,pt2){
	const pt1DistToDest = pt1.distToDest
	const pt2DistToDest = pt2.distToDest
	const pt1Pos = pt1.vPos
	const pt2Pos = pt2.vPos
	// assume stepSize (speed) is same
	let ratio
	if(pt1DistToDest === pt2DistToDest){
		ratio = 0.5
	} else if (pt1DistToDest > pt2DistToDest){
		const distBetween = pt1Pos.distanceTo(pt2Pos)
		ratio = (distBetween - pt1DistToDest + pt2DistToDest)/ (2 * distBetween)
	} else { // pt1DistToDest < pt2DistToDest
		const distBetween = pt2Pos.distanceTo(pt1Pos)
		ratio = (distBetween - pt2DistToDest - pt1DistToDest)/ (2 * distBetween)
	}
	return new THREE.Vector3(
		pt1Pos.x + (pt2Pos.x-pt1Pos.x) * ratio,
		pt1Pos.y + (pt2Pos.y-pt1Pos.y) * ratio,
		pt1Pos.z + (pt2Pos.z-pt1Pos.z) * ratio
	)
}

export function calcNormal3Pts(v1, v2, v3){
	const vNormal = new THREE.Vector3(
		v1.y * v2.z - v1.z * v2.y,
		v1.z * v2.x - v1.x * v2.z,
		v1.x * v2.y - v1.y * v2.x
	)
	return vNormal.normalize()
}
