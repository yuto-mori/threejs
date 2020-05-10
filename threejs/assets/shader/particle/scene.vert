attribute float size;
attribute vec4 color;
varying vec4 vColor;
varying vec3 vPosition;
varying vec2 vUv;
uniform float time;
const float PI = 3.14159;
float random (vec2 p) {
   return fract(sin(dot(p.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

   void main() {
      float random = random(vec2(position.x,position.y));
      vColor = color;
      vec3 posChanged = position;
      posChanged.x = posChanged.x * sqrt(step(random*abs(time),1.0)) ;
      posChanged.y = posChanged.y * sqrt(step(random*abs(time),1.0)) ;
      vec4 mvPosition = modelViewMatrix * vec4(posChanged, 1.0);
      gl_PointSize = size;
      gl_Position = projectionMatrix * mvPosition;
   }