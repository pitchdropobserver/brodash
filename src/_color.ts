import { IRgb, IRgba, ObjStringVal } from './_interfaces'

export function rgbToHex(r: number, g: number, b: number): string{
	const R: string = r.toString(16)
	const G: string = g.toString(16)
	const B: string = b.toString(16)
	return (
		(R.length === 1 ? '0'+R : R) +
		(G.length === 1 ? '0'+G : G) +
		(B.length === 1 ? '0'+B : B)
	)
}

export function oRgbToHex(oRgb: IRgb): string{
	const { r, g, b } = oRgb
	const R: string = r.toString(16)
	const G: string = g.toString(16)
	const B: string = b.toString(16)
	return (
		(R.length === 1 ? '0'+R : R) +
		(G.length === 1 ? '0'+G : G) +
		(B.length === 1 ? '0'+B : B)
	)
}

export function hexToRgb(hex: string): IRgb{
	hex = hex.replace('#','')
	return {
		r: parseInt(hex.substring(0,2), 16),
		g: parseInt(hex.substring(2,4), 16),
		b: parseInt(hex.substring(4,6), 16)
	}
}

export function rgbaToDecimal(rgba: IRgba): IRgba{
	return {
		r: Math.round(rgba.r / 255 * 1000) / 1000,
		g: Math.round(rgba.g / 255 * 1000) / 1000,
		b: Math.round(rgba.b / 255 * 1000) / 1000,
		a: rgba.a
	}
}

export function getRandColor(strColorFormat: string = 'rgb'): string|undefined{
	let r: number|string = Math.round(Math.random()*255),
		g: number|string = Math.round(Math.random()*255),
		b: number|string = Math.round(Math.random()*255)
	switch (strColorFormat) {
		case 'rgb':
			return `rgb(${r},${g},${b})`
		case 'rgba':
			return `rgb(${r},${g},${b},1.0)`
		case 'hex':
			r = r.toString(16)
			r = r.length === 1 ? '0'+r : r
			g = g.toString(16)
			g = g.length === 1 ? '0'+g : g
			b = b.toString(16)
			b = b.length === 1 ? '0'+b : b
			return '0x'+r+g+b
	}
}

const CSS_COLOR_NAMES: ObjStringVal = { aliceblue:'#f0f8ff',antiquewhite:'#faebd7',aqua:'#00ffff',aquamarine:'#7fffd4',azure:'#f0ffff',beige:'#f5f5dc',bisque:'#ffe4c4',black:'#000000',blanchedalmond:'#ffebcd',blue:'#0000ff',blueviolet:'#8a2be2',brown:'#a52a2a',burlywood:'#deb887',cadetblue:'#5f9ea0',chartreuse:'#7fff00',chocolate:'#d2691e',coral:'#ff7f50',cornflowerblue:'#6495ed',cornsilk:'#fff8dc',crimson:'#dc143c',cyan:'#00ffff',darkblue:'#00008b',darkcyan:'#008b8b',darkgoldenrod:'#b8860b',darkgray:'#a9a9a9',darkgreen:'#006400',darkkhaki:'#bdb76b',darkmagenta:'#8b008b',darkolivegreen:'#556b2f',darkorange:'#ff8c00',darkorchid:'#9932cc',darkred:'#8b0000',darksalmon:'#e9967a',darkseagreen:'#8fbc8f',darkslateblue:'#483d8b',darkslategray:'#2f4f4f',darkturquoise:'#00ced1',darkviolet:'#9400d3',deeppink:'#ff1493',deepskyblue:'#00bfff',dimgray:'#696969',dodgerblue:'#1e90ff',firebrick:'#b22222',floralwhite:'#fffaf0',forestgreen:'#228b22',fuchsia:'#ff00ff',gainsboro:'#dcdcdc',ghostwhite:'#f8f8ff',gold:'#ffd700',goldenrod:'#daa520',gray:'#808080',green:'#008000',greenyellow:'#adff2f',honeydew:'#f0fff0',hotpink:'#ff69b4',indianred:'#cd5c5c',indigo:'#4b0082',ivory:'#fffff0',khaki:'#f0e68c',lavender:'#e6e6fa',lavenderblush:'#fff0f5',lawngreen:'#7cfc00',lemonchiffon:'#fffacd',lightblue:'#add8e6',lightcoral:'#f08080',lightcyan:'#e0ffff',lightgoldenrodyellow:'#fafad2',lightgrey:'#d3d3d3',lightgreen:'#90ee90',lightpink:'#ffb6c1',lightsalmon:'#ffa07a',lightseagreen:'#20b2aa',lightskyblue:'#87cefa',lightslategray:'#778899',lightsteelblue:'#b0c4de',lightyellow:'#ffffe0',lime:'#00ff00',limegreen:'#32cd32',linen:'#faf0e6',magenta:'#ff00ff',maroon:'#800000',mediumaquamarine:'#66cdaa',mediumblue:'#0000cd',mediumorchid:'#ba55d3',mediumpurple:'#9370d8',mediumseagreen:'#3cb371',mediumslateblue:'#7b68ee',mediumspringgreen:'#00fa9a',mediumturquoise:'#48d1cc',mediumvioletred:'#c71585',midnightblue:'#191970',mintcream:'#f5fffa',mistyrose:'#ffe4e1',moccasin:'#ffe4b5',navajowhite:'#ffdead',navy:'#000080',oldlace:'#fdf5e6',olive:'#808000',olivedrab:'#6b8e23',orange:'#ffa500',orangered:'#ff4500',orchid:'#da70d6',palegoldenrod:'#eee8aa',palegreen:'#98fb98',paleturquoise:'#afeeee',palevioletred:'#d87093',papayawhip:'#ffefd5',peachpuff:'#ffdab9',peru:'#cd853f',pink:'#ffc0cb',plum:'#dda0dd',powderblue:'#b0e0e6',purple:'#800080',rebeccapurple:'#663399',red:'#ff0000',rosybrown:'#bc8f8f',royalblue:'#4169e1',saddlebrown:'#8b4513',salmon:'#fa8072',sandybrown:'#f4a460',seagreen:'#2e8b57',seashell:'#fff5ee',sienna:'#a0522d',silver:'#c0c0c0',skyblue:'#87ceeb',slateblue:'#6a5acd',slategray:'#708090',snow:'#fffafa',springgreen:'#00ff7f',steelblue:'#4682b4',tan:'#d2b48c',teal:'#008080',thistle:'#d8bfd8',tomato:'#ff6347',turquoise:'#40e0d0',violet:'#ee82ee',wheat:'#f5deb3',white:'#ffffff',whitesmoke:'#f5f5f5',yellow:'#ffff00',yellowgreen:'#9acd32',
}

export function cssColorNameToCssHex(colorName: string): string {
	const name = colorName.toLowerCase()
	return CSS_COLOR_NAMES[name]
}
