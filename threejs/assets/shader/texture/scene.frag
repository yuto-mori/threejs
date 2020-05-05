//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
varying vec4 vColor;
uniform vec2 resolution;
varying vec2 vUv;
uniform sampler2D uTex;// テクスチャは sampler2D 型

void main() {
  vec4 color = texture2D( uTex, vUv );// texture2D() でテクスチャのuv座標地点の色 rgba を取得
  gl_FragColor = vec4(color);
}