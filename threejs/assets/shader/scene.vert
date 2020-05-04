//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

attribute float size;
attribute vec4 color;
varying vec4 vColor;
varying vec3 vPosition;
varying vec2 vUv;
uniform float time;
float PI = 3.14159;
//glsl乱数取得のよくあるコード
float random (vec2 p) {
   return fract(sin(dot(p.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

   void main() {
      float random01 = random(vec2(position.x,position.y));
      float random02 = random(vec2(position.x* 0.1,position.y * 0.1));
      float random03 = random(vec2(position.x * 0.2,position.y * 0.2));
      vUv = uv;
      vColor = color;
      vPosition = position;
      vec3 posChanged = position;
      //random03を掛け合わせているのは粒子をよりまばらにするため
      posChanged.x = sqrt(random02 * random03) * 200.0 * cos(random01 * PI * 2.0) ;
      posChanged.y = sqrt(random02 * random03) * 200.0 * sin(random01 * PI * 2.0) ;
      posChanged.z = posChanged.z;
      vec4 mvPosition = modelViewMatrix * vec4(posChanged, 1.0);
      gl_PointSize = size;
      gl_Position = projectionMatrix * mvPosition;
   }