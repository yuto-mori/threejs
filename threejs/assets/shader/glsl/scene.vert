//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

attribute float size;
attribute vec4 color;
varying vec4 vColor;
uniform float time;

   void main() {
      vColor = color;
      gl_PointSize = size;
      gl_Position = vec4(position, 1.0);
   }