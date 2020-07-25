//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
precision highp float;
varying vec4 vColor;
uniform vec2 resolution;
varying vec2 vUv;
uniform sampler2D uTex;// テクスチャは sampler2D 型
uniform vec2 mouse;
float fRadius;
float fUzuStrength;

void main() {

  float fRadius = 100.0;
  float fUzuStrength = 3.0;
  //uvは左上を原点とした0~1の座標
  vec2 pos = (vUv * resolution) - mouse;
  //length原点0からのxy(vec2時)地点までの長さ
  float len = length(pos);
  //lenは中心を0とした時のx,yの長さ。fRadius以下　の長さだと通常通りの色がつかない
  if(len >= fRadius) {
    gl_FragColor = texture2D(uTex, vUv);
    return;
  }

  //0 ~ 1　* fUzuStrengthの値をとる
  //xyの長さがfRadius 以上で0より小さくなる
  float uzu = min(max(1.0 - (len / fRadius), 0.0), 1.0) * fUzuStrength;
  //マウスを中心として、fUzuStrength以内で遠ければ遠いほど変化の度合いが大きくなる(sin,cosにはいる値が大きくなる)
  //xは左にずれる(マウスの位置から値が減る),yは上にずれる(マウスの位置から値が増える)
  //xyの+-で互いを補っていると考えよう。三角関数を使えばなんとなく円の動きに近くなるのだろう
  float x = pos.x * cos(uzu) - pos.y * sin(uzu); 
  float y = pos.x * sin(uzu) + pos.y * cos(uzu);
  //変化している場所をマウスの場所に移す
  //resolution で割るのは 0 ~ 1の値にするため
  vec2 retPos = (vec2(x, y) + mouse) / resolution;
  //utex（画像の）ピクセルから、retPos座標に合うものを取ってきて表示させる
  vec4 color = texture2D(uTex, retPos);
  gl_FragColor = color;
}