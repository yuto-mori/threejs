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
  const camera = new THREE.PerspectiveCamera(50, 600 / 600, 0.1, 2000);

  //カメラの位置
  camera.position.set(0, 0, 600 / 2 / Math.tan((25 * Math.PI) / 180));
  //全体をうつす時のカメラ位置 (height or width)/2/Math.tan(fov/2 * Math.PI/180)
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
    '/threejs/assets/shader/glsl/scene.vert',
    '/threejs/assets/shader/glsl/scene.frag',
    (shader) => {
      const vertexShader = shader.vs;
      const fragmentShader = shader.fs;
      init(vertexShader, fragmentShader);
    }
  );

  // geometry
  function init(vertexShader, fragmentShader): void {
    // geometry ポイントスプライト
    // https://threejs.org/docs/#api/en/core/BufferGeometry
    // https://qiita.com/kitasenjudesign/items/1657d9556591284a43c8
    // シェーダに送れるデフォルトの値
    // position, faceIndex, normal, color, uv, uv2
    const geometry = new THREE.BufferGeometry();
    const verticesBase = [];
    let i = 0;
    for (let x = -300; x <= 300; x++) {
      i += 10;
      for (let y = -300; y <= 300; y++) {
        verticesBase.push(x);
        verticesBase.push(-y);
        verticesBase.push(0);
      }
    }
    console.log(verticesBase);
    //https://threejs.org/docs/#api/en/core/bufferAttributeTypes/BufferAttributeTypes
    const vertices = new THREE.Float32BufferAttribute(verticesBase, 3);
    geometry.addAttribute('position', vertices);

    // Material

    //type参考
    //https://qiita.com/kitasenjudesign/items/1657d9556591284a43c8
    const uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(600, 600),
      },
    };
    const meshMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
    });

    const cloud = new THREE.Points(geometry, meshMaterial);
    scene.add(cloud);

    renderer.render(scene, camera);
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