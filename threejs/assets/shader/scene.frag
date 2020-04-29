varying vec2 vUv;
uniform sampler2D uTex;// テクスチャは sampler2D 型

void main() {
  vec3 color = texture2D( uTex, vUv ).rgb;// texture2D() でテクスチャのuv座標地点の色 rgba を取得

  gl_FragColor = vec4( color, 1.0 );
}