const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // https://github.com/jantimon/html-webpack-plugin#options

const htmlWebpackPlugin = new HtmlWebpackPlugin({
	// Automatically inject a script reference to the bundle output in 
	// inject: true,
	template: path.join(__dirname, `examples/src/index.html`),
	filename: `./index.html`, // affects path of file hosted by dev server eg. './temp/app.html' --> 'localhost:3001/temp/app.html'
})

module.exports = {
	entry: path.join(__dirname, 'examples/src/index.js'), // Resolve source dependencies using examples/src/index.js as a starting point
	output: {
		path: path.join(__dirname, 'examples/dist'), // does not effect dev server
		filename: 'index.js'
	},
	module: {
		rules: [ 
			{ test: /\.css$/, use: ['style-loader', 'css-loader']},
			{ test: /\.ts(x?)$/, use: 'ts-loader' },
			{ test: /\.json$/, use: 'json-loader' },	
			{ test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },						
		]
	},
	plugins: [ htmlWebpackPlugin ],
	resolve: {
		extensions: ['.ts','.js','.jsx','.json']
	},
	devServer: {
		// contentBase: path.join(__dirname, 'examples'),
		port: 3001 // Serve the demo on port localhost:3001
	}
}