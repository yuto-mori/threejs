//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

uniform float size;
attribute vec4 color;
varying vec4 vColor;
varying vec2 vUv;

   void main() {
      vUv = uv;
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      gl_PointSize = size;
      gl_Position = projectionMatrix * mvPosition;
   }