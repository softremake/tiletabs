const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  context: path.resolve(process.cwd(), 'probe'),

  entry: {
    demo: './demo.tsx' // the entry point of our app
  },

  output: {
    path: path.join(__dirname, '..', 'bundles'),
    filename: "[name].js",
    libraryTarget:"umd",
  },

  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
    "react-dom":{
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom'
    }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['awesome-typescript-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  performance: {
    hints: false,
  },
  plugins: [
    new HtmlWebpackPlugin({template: 'index.html.ejs',})
  ],
}
