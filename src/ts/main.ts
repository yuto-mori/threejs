/* eslint-disable @typescript-eslint/no-use-before-define */
import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', () => {
  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  // レンダラーのサイズを設定
  renderer.setSize(600, 600);

  // シーンを作成
  const scene = new THREE.Scene();
  /**
   * カメラを作成
   * @param {number} fov - 視野角 推奨 50
   * @param {number} aspect - アスペクト比 推奨 window.innerWidth/window.innerHeight
   * @param {number} near - カメラのどのくらい近くからThree.jsが描画を開始するか 推奨 0.1
   * @param {number} far - カメラからどのくらい遠くまで見えるか 推奨 2000
   */
  const camera = new THREE.PerspectiveCamera(45, 600 / 600, 0.1, 2000);

  //カメラの位置
  camera.position.set(0, 0, 1000);
  camera.lookAt(new THREE.Vector3());

  // canvasをbodyに追加
  document.getElementById('js-webgl-output').appendChild(renderer.domElement);

  /**
   * シェーダーの読み込み
   * @param {string} vsPath - 頂点シェーダファイル
   * @param {string} fsPath - フラグメントシェーダ
   * @param {function} callback
   */
  loadShaderSource(
    '/threejs/assets/shader/scene.vert',
    '/threejs/assets/shader/scene.frag',
    (shader) => {
      const vertexShader = shader.vs;
      const fragmentShader = shader.fs;
      init(vertexShader, fragmentShader);
    }
  );

  // geometry
  function init(vertexShader, fragmentShader): void {
    // geometry ポイントスプライト
    const geometry = new THREE.BufferGeometry();
    const verticesBase = [];
    let width = 600;              
    let half = width / 2.0;       
    let interval = 12;           
    let count = width / interval;
    const colorsBase = [];
    const uv = [];
    for(let i = 0; i <= count; ++i){
      // 横位置
      let x = -half + i * interval;
      for(let j = 0; j <= count; ++j){
          // 縦位置
          let y = -half + j * interval;
          verticesBase.push(x, y, 0.0);
          uv.push(i / count,  j / count);
          colorsBase.push(255.0,255.0,255.0,1);
      }
  }
  //https://threejs.org/docs/#api/en/core/bufferAttributeTypes/BufferAttributeTypes
    const vertices = new THREE.Float32BufferAttribute(verticesBase, 3);
    geometry.addAttribute('position', vertices);
    const uvs = new THREE.Float32BufferAttribute(uv, 2);
    geometry.addAttribute('uv', uvs);
    const colors = new THREE.Uint8BufferAttribute(colorsBase, 4);
    colors.normalized = true;
    geometry.addAttribute( 'color', colors );

    // Material
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      '/threejs/assets/img/carousel01/01.jpg',
      onRender
    );

    function onRender(): void {
      const uniforms = {
        size: {
          type: 'f',
          value: 5,
        },
        uTex: { value: texture },
      };

      const meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });

      const cube = new THREE.Points(geometry, meshMaterial);

      scene.add(cube);

      renderer.render(scene, camera);
    }
  }

  function loadShaderSource(vsPath, fsPath, callback): void {
    let vs, fs;
    xhr(vsPath, true);
    xhr(fsPath, false);
    function xhr(source, isVertex): void {
      const xml = new XMLHttpRequest();
      xml.open('GET', source, true);
      xml.setRequestHeader('Pragma', 'no-cache');
      xml.setRequestHeader('Cache-Control', 'no-cache');
      xml.onload = (): void => {
        if (isVertex) {
          vs = xml.responseText;
        } else {
          fs = xml.responseText;
        }
        if (vs != null && fs != null) {
          console.log('loaded', vsPath, fsPath);
          callback({ vs: vs, fs: fs });
        }
      };
      xml.send();
    }
  }
});
