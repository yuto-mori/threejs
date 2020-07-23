//webpack参考
//https://ics.media/entry/12140/
module.exports = {
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: {
    main: './src/ts/main.ts',
    'glsl/glsl': './src/ts/glsl.ts',
    'texture/texture': './src/ts/texture.ts',
    'particle/particle': './src/ts/particle.ts',
    'ray/ray': './src/ts/ray.ts',
    'carousel-fullsize/carousel-fullsize': './src/ts/carousel-fullsize.ts',
    'carousel02/carousel02': './src/ts/carousel02.ts',
    'texture-fullsize/texture-fullsize': './src/ts/texture-fullsize.ts',
  },
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: [
          {
            loader: 'ts-loader',
            //型チェックはIDEだけでおこなう
            //参考:https://mizchi.hatenablog.com/entry/2020/05/03/151022
            options: {
              transpileOnly: true,
            },
          },
        ],
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
    filename: '[name].js',
  },
};
