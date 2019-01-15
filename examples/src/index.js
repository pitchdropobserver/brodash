import React from 'react'
import ReactDOM from 'react-dom'
import { createSvgElem } from '../../src/'

const svg = createSvgElem({
	parent: document.getElementById('root'),
	tag: 'svg',
	style: {
		'background': '#eee',
	},
	attr: {
		'width': 500,
		'height': 500,
	},
})

createSvgElem({
	parent: svg,
	tag: 'circle',
	style: {
		'fill': 'white',
		'stroke': 'black',
		'stroke-width': '5px',
		'cursor': 'pointer',
	},
	attr: {
		'cx': 250,
		'cy': 250,
		'r': 50,
	},
})


// ReactDOM.render(
// 	<App/>,
// 	document.getElementById('root')
// )


// class App extends React.Component {
// 	render(){
// 		return (
// 			<h1>This is brodash</h1>
// 		)
// 	}
// }