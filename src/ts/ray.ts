/* eslint-disable @typescript-eslint/no-use-before-define */
import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', () => {
  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));

  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  // シーンを作成
  const scene = new THREE.Scene();
  /**
   * カメラを作成
   * @param {number} fov - 視野角 推奨 50
   * @param {number} aspect - アスペクト比 推奨 window.innerWidth/window.innerHeight
   * @param {number} near - カメラのどのくらい近くからThree.jsが描画を開始するか 推奨 0.1
   * @param {number} far - カメラからどのくらい遠くまで見えるか 推奨 2000
   */
  //カメラサイズが小さいとウィンドウ幅が大きくなると画面から画が消える（画とwindowsizeを合わせた時）
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 5000);

  //全体をうつす時のカメラ位置 (height or width)/2/Math.tan(fov/2 * Math.PI/180)
  camera.lookAt(new THREE.Vector3());
  function onResize(): void {
    // サイズを取得
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    // レンダラーのサイズを調整する
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(windowWidth, windowHeight);

    // カメラのアスペクト比を正す
    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();
    //カメラの位置
    camera.position.set(0, 0, windowWidth / 2 / Math.tan((25 * Math.PI) / 180));
  }
  // 初期化のために実行
  onResize();
  // リサイズイベント発生時に実行
  window.addEventListener('resize', onResize);

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
    const verticesBase = [-1, 1, 0.0, 1, 1, 0.0, -1, -1, 0.0, 1, -1, 0.0];
    //頂点を結ぶ順番
    //https://qiita.com/edo_m18/items/ea34ad77238d0caf5142
    const indice = [0, 2, 1, 1, 2, 3];

    //https://threejs.org/docs/#api/en/core/bufferAttributeTypes/BufferAttributeTypes
    const vertices = new THREE.Float32BufferAttribute(verticesBase, 3);
    geometry.addAttribute('position', vertices);
    const indices = new THREE.Uint32BufferAttribute(indice, 1);
    geometry.addAttribute('index', indices);

    // Material
    //type参考
    //https://qiita.com/kitasenjudesign/items/1657d9556591284a43c8
    const uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(windowWidth, windowHeight),
      },
      time: {
        type: 'f',
        value: 0.0,
      },
    };
    const meshMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
    });

    const mesh = new THREE.Mesh(geometry, meshMaterial);
    scene.add(mesh);

    render();
    const startTime = Date.now();
    let nowTime = 0;

    function render(): void {
      nowTime = (Date.now() - startTime) / 1000;
      meshMaterial.uniforms.time.value = nowTime;
      requestAnimationFrame(render);
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
