const webpack = require('webpack');
const path = require('path');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const config = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'bundle.js'
  },
  mode: "development",
  plugins: [
    new LiveReloadPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react']
            }
          }
        ],
      }
    ]
  }
};
module.exports = config;