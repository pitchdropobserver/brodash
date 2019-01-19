export class Grid {
	constructor(x, y, w, h, nx, ny) {
		this.arrPts = []
		const cell_w = w / nx
		const cell_h = h / ny
		let i, j
		for (i = 0; i < nx; i++) {
			for (j = 0; j < ny; j++) {
				this.arrPts.push({
					x: x + cell_w * i,
					y: y + cell_h * j,
				})
			}
		}
	}
	getPts() {
		return this.arrPts
	}
}
