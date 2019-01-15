import { XMLNS_SVG } from './_constants'

export function calcAndSaveDomPosition(){
	const boundingBox = this.getBoundingClientRect()
	const {
		top, right, bottom, left
	} = boundingBox
	this.bboxT = top
	this.bboxR = right
	this.bboxB = bottom
	this.bboxL = left
	this.bboxW = right - left
	this.bboxH = right - left
}

export function createSvgElem(optn) {
	const { parent, tag, attr, style } = optn;
	const elem = document.createElementNS(XMLNS_SVG, tag);
	for (let a in attr) { elem.setAttributeNS(null, a, attr[a]); }
	for (let s in style) { elem.style[s] = optn.style[s]; }
	parent.appendChild(elem);
	return elem;
}

export function createDomElem(optn) {
	const { parent, tag, attr, style } = optn
	const elem = document.createElement(tag);
	for (let a in attr) { elem.setAttribute(a, attr[a]); }
	for (let s in style) { elem.style[s] = optn.style[s]; }
	parent.appendChild(elem);
	return elem;
}

export function createHatch(parentSvg, maskId) {
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

export function getFontSizeByClass(strClassName) {
	// NOTE: assume all font-size are written in '[xx]rem' format
	// reference correct project stylesheet
	const oCssStyleRules = document.styleSheets[0].cssRules
	for (let i in oCssStyleRules) {
		if (oCssStyleRules[i].selectorText === strClassName) {
			const strFontSize = oCssStyleRules[i].style.fontSize
			const indexSuffix = strFontSize.search('rem')
			return Number( // NOTE: as unit of rem
				strFontSize.substring(0, indexSuffix)
			)
		}
	}
}
