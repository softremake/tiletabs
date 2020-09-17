const path = require('path');

module.exports = {
  mode: 'production',
  output: {
    path: path.join(__dirname, '..', 'lib'),
    library: "TileTabs",
    libraryTarget:"umd",
    filename: "[name].js"
  },
  entry: {
    tiletabs: "./src/index.ts"
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
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['awesome-typescript-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader',           {
          loader: "css-loader",
          options: {
            sourceMap: true
          }
        }, 'sass-loader'],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ],
  }
};
