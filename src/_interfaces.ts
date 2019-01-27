export interface IPt {
	x: number
	y: number
	z?: number
}

export interface IVec3d {
	x: number
	y: number
	z: number
}


export interface ILine {
	x1: number
	y1: number
	z1?: number
	x2: number
	y2: number
	z2?: number
}

export interface IRgb {
	r: number
	g: number
	b: number
}

export interface IRgba {
	r: number
	g: number
	b: number
	a: number
}

export type ObjStringVal = {
	[index: string]: string
}

