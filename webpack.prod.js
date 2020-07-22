/* eslint-disable @typescript-eslint/no-var-requires */
//本場用
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
});
