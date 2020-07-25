//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
precision highp float;
varying vec4 vColor;

void main() {
  gl_FragColor = vec4( vColor ) ;
}