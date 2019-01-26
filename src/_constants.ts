export const XMLNS_SVG: string = 'http://www.w3.org/2000/svg'

export const XMLNS_XLINK: string = 'http://www.w3.org/1999/xlink'

export const FPS: number = 60

export const FPMS: number = FPS / 1000  // frames per millisecond

export const MSPF: number = 1000 / FPS  // milliseconds per frame

export const MONTHS_TITLE_CASE: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const SYMB_KEY_SVG_TAG: Symbol = Symbol()

export const MONOSPACE_CHAR_DIM: {
	[index: string]: { 
		w: number
		h: number 
	}
} = {
	// all font-weights produce same width for 'monospace'
	'36px': { w: 21.603515625, h: 41 },
	'24px': { w: 14.40234375, h: 28 },
	'18px': { w: 10.8017578125, h: 21 },
	'16px': { w: 9.6015625, h: 18 },
	'14px': { w: 8.4013671875, h: 16 },
	'12px': { w: 7.201171875, h: 14 },
	'11px': { w: 6.60107421875, h: 13 },
	'10px': { w: 6.0009765625, h: 12 },
	'9px': { w: 5.40087890625, h: 10 },
	'8px': { w: 4.80078125, h: 9 },
	'7px': { w: 4.20068359375, h: 8 },
	'6px': { w: 3.6005859375, h: 7 },
}
