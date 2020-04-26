//webpack参考
//https://ics.media/entry/12140/
module.exports = {
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: './src/ts/main.ts',
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: 'ts-loader',
      },
    ],
  },
  // import 文で .ts ファイルを解決するため
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/threejs/assets/js`,
  },
};
