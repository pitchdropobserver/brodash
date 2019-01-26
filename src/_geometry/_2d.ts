import { IPt } from '../_interfaces'

export class Grid {
	
	public arrPts: Array<IPt> = []
	
	constructor(x: number, y: number, w: number, h: number, nx:number, ny: number) {
		const cell_w: number = w / nx
		const cell_h: number = h / ny
		let i: number, j: number
		for (i = 0; i < nx; i++) {
			for (j = 0; j < ny; j++) {
				this.arrPts.push({
					x: x + cell_w * i,
					y: y + cell_h * j,
				})
			}
		}
	}

	public getPts(): Array<IPt> {
		return this.arrPts
	}
}


