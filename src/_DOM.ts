import { XMLNS_SVG } from './_constants'

export function calcAndSaveDomPosition(this: any): void{
	const { top, right, bottom, left } = this.getBoundingClientRect()
	this.bboxT = top
	this.bboxR = right
	this.bboxB = bottom
	this.bboxL = left
	this.bboxW = Math.abs(right - left)
	this.bboxH = Math.abs(bottom - top)
}

type Optn = {
	parent: HTMLElement
	tag: string
	attr?: Object,
	style?: Object
}
export function createSvgElem(optn: Optn): HTMLElement {
	const { parent, tag, attr, style } = optn
	const elem = <HTMLElement>document.createElementNS(XMLNS_SVG, tag)
	for (let a in attr) { elem.setAttributeNS(null, a, attr[a]) }
	for (let s in style) { elem.style[s] = style[s] }
	parent.appendChild(elem)
	return elem
}

export function createDomElem(optn: Optn): HTMLElement {
	const { parent, tag, attr, style } = optn
	const elem = <HTMLElement>document.createElement(tag)
	for (let a in attr) { elem.setAttribute(a, attr[a]) }
	for (let s in style) { elem.style[s] = style[s] }
	parent.appendChild(elem)
	return elem
}

export function createHatch(parentSvg: HTMLElement, maskId: string): void {
	const defs = createSvgElem({
		parent: parentSvg,
		tag: 'defs',
	})
	const pattern = createSvgElem({
		parent: defs,
		tag: 'pattern',
		attr: {
			id: 'pattern-stripe',
			width: '4',
			height: '4',
			patternUnits: "userSpaceOnUse",
			patternTransform: "rotate(45)",
		},
	})

	const rect1 = createSvgElem({ // actual pattern unit
		parent: pattern,
		tag: 'rect',
		attr: {
			x: maskId === 'mask-stripe-buy' ? 0 : 2,
			y: 0,
			width: '2',
			height: '4',
			transform: 'translate(' + 0 + ',' + 0 + ')',
			fill: 'white',
		},
	})

	const mask = createSvgElem({
		parent: defs,
		tag: 'mask',
		attr: {
			id: maskId,
		}
	})

	const rect2 = createSvgElem({
		parent: mask,
		tag: 'rect',
		attr: {
			x: '0',
			y: '0',
			width: '100%',
			height: '100%',
			fill: 'url(#pattern-stripe)',
		},
	})
}

export function getFontSizeByClass(strClassName: string): number | undefined {
	// NOTE: assume all font-size are written in '[xx]rem' format
	// reference correct project stylesheet
	const oCssStyleRules = (<CSSStyleSheet>document.styleSheets[0]).cssRules
	let cssRule: CSSStyleRule,
		strFontSize: string | null,
		indexSuffix: number
	for (let i in oCssStyleRules) {
		cssRule = oCssStyleRules[i] as CSSStyleRule
		if (cssRule.selectorText === strClassName) {
			strFontSize = cssRule.style.fontSize
			if (strFontSize !== null){
				indexSuffix = strFontSize.search('rem')
				return Number( // NOTE: as unit of rem
					strFontSize.substring(0, indexSuffix)
				)
			}		
		}
	}
}
