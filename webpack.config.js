const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // The entry point file described above
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
	clean: true
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ],
  
  // needed to import the css file
  module: {
     rules: [
       {
         test: /\.css$/,
         use: ['style-loader', 'css-loader'],
       },
     ],
   },
   
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: 'eval-source-map',

  // dg For compiling after save
  // Read this: https://webpack.js.org/configuration/watch/#watch
  watchOptions: {
    ignored: '**/node_modules',
    aggregateTimeout: 200,
    poll: 1000,
  },
};