//Built-in uniforms and attributes
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
varying vec4 vColor;
uniform vec2 resolution;
uniform float time;

const float PI = 3.1415926;

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float ss = sin( 0.5);
    float cc = cos( 0.5);
    vec2 q = mat2(cc, -ss, ss, cc) * p;//行列で斜めに
    vec2 v = (mod((q * 3.0 + vec2(step(0.0,abs(p.x)),step(0.0,abs(p.y)))), 2.0) - 1.0) ;
    vec2 v2 = (mod((q * 3.0), 2.0) - 1.0) ;
    
    //繰り返し + は位置をずらしている
    //まず値を大きくする(例えば2)、0は-1に2をかけているなら1/4の0.5が0になる1はまた-1に(0.999~ 1の近似値)。2以上でもその繰り返し
    float f = length(v);//外に向かってボケていく円 -1.0 で反転
    float r = (f - 0.0);//円の大きさ
    float rr = step(1.0,f)-1.0 ;
    //多重模様で1.0以上は黒にするための計算 stepで出た値で掛ければ 1を掛ければそのまま 
    //0で掛ければ0になるので
    float c = sin(length(r) * 5.0) * rr ;//多重模様
    
    //上の式の繰り返し （本当はファンクションで書くべき）
    float f2 = length(v2);//外に向かってボケていく円 -1.0 で反転
    float r2 = (f2 - 0.0);//円の大きさ
    float rr2 = step(1.0,f2)-1.0 ;
    float c2 = sin(length(r2) * 5.0) * rr2 ;//多重模様
    
    float c3 = c+ c2;//色付けするための出た結果を足すと合成される
    
    //float m = step(0.0,c);//stepで1か0に。ぼかしがなくなる
    float red = c3 * 1.0;
    float green = c3 * sin(time+2.0);
    float blue = c3 * 0.6;
    gl_FragColor = vec4(vec3(red,green,blue), 1.0);//vec3に例えばc2をかけても面白い効果出る
}