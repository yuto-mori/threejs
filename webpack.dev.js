/* eslint-disable @typescript-eslint/no-var-requires */
//開発用
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
});
