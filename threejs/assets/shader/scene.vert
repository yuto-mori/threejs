//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

attribute float size;
attribute vec4 color;
varying vec4 vColor;
varying vec2 vUv;
uniform float time;

   void main() {
      vUv = uv;
      vColor = color;
      vec3 posChanged = position;
      posChanged.x = posChanged.x;
      posChanged.y = posChanged.y;
      posChanged.z = -300.0 * (abs(sin(time*1.0)));
      vec4 mvPosition = modelViewMatrix * vec4(posChanged, 1.0);
      gl_PointSize = size;
      gl_Position = projectionMatrix * mvPosition;
   }