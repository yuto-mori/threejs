//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

uniform float size;
varying vec2 vUv;


   void main() {
      vUv = uv;
      vec4 mvPosition = vec4(position, 1.0);
      
      gl_PointSize = size;
      gl_Position =  mvPosition;
   }