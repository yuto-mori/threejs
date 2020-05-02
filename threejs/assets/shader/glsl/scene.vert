//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
attribute vec4 color;
varying vec4 vColor;

   void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = 1.0;
      gl_Position = projectionMatrix * mvPosition;
   }