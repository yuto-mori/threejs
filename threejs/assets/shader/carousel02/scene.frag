//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
#define PI 3.14159265359
precision highp float;
varying vec4 vColor;
uniform vec2 resolution;
varying vec2 vUv;
uniform sampler2D uTex01;// テクスチャは sampler2D 型
uniform sampler2D uTex02;// テクスチャは sampler2D 型
uniform sampler2D uTex03;// テクスチャは sampler2D 型
uniform float dispFactor;

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}

void main() {

  vec4 disp = texture2D(uTex03, vUv);
  vec2 calcPos = vec2(-0.05) + vUv + rotate2d(PI) * vec2(disp.r / 10.0, disp.g / 10.0) + (1.0 - dispFactor) * 0.1;

  vec4 _uTex01 = texture2D(uTex01, vUv);
  vec4 _uTex02 = texture2D(uTex01, calcPos);
  vec4 color = mix(_uTex01,_uTex02, dispFactor);
  gl_FragColor = color;
}