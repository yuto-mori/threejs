//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
varying vec4 vColor;
uniform vec2 resolution;

void main() {
  gl_FragColor = vec4(vec3(gl_FragCoord.x / resolution.x ),1.0);
}