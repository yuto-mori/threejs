//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
attribute vec4 color;
varying vec4 vColor;
//modelViewMatrix と projectionMatrix を消すと position の値が-1~1の間で行ける
   void main() {
      vec4 mvPosition = vec4(position, 1.0);
      gl_Position = mvPosition;
   }