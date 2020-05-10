/* eslint-disable @typescript-eslint/no-use-before-define */
import * as THREE from 'three';
import * as dat from 'dat.gui';

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
  camera.position.set(0, 0, 512 / 2 / Math.tan((25 * Math.PI) / 180));
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
    '/threejs/assets/shader/particle/scene.vert',
    '/threejs/assets/shader/particle/scene.frag',
    (shader) => {
      const vertexShader = shader.vs;
      const fragmentShader = shader.fs;
      init(vertexShader, fragmentShader);
    }
  );

  // geometry
  function init(vertexShader, fragmentShader): void {

    const controls = new (function () {
      this.particleWidth = 256;

      this.updateWidth = function(){
        if (scene.getObjectByName("particles")) {
          scene.remove(scene.getObjectByName("particles"));
      }
      createParticles(controls.particleWidth);
      }
    });
    const gui = new dat.GUI();
    gui
      .add(controls, 'particleWidth', 0, 512, 1)
      .onChange(controls.updateWidth);

    const startTime = Date.now();
    let nowTime = 0;
    let meshMaterial;
    let cloud;
    controls.updateWidth();
    render();

    function createParticles(particleWidth) {
      // geometry ポイントスプライト
      // https://threejs.org/docs/#api/en/core/BufferGeometry
      // https://qiita.com/kitasenjudesign/items/1657d9556591284a43c8
      // シェーダに送れるデフォルトの値
      // position, faceIndex, normal, color, uv, uv2
      const geometry = new THREE.BufferGeometry();
      const verticesBase = [];
      const colorsBase = [];
      const size = [];
      let width = particleWidth;
      let height = particleWidth;
      let depth =  particleWidth;
      let halfX = width / 2.0;
      let halfY = height / 2.0;
      let halfZ = height / 2.0;
      const interval = 20;
      let countX = width / interval;
      let countY = height / interval;
      let countZ = depth / interval;
      for (let i = 0; i <= countX; ++i) {
        // 横位置
        const x = -halfX + i * interval;
        for (let j = 0; j <= countY; ++j) {
          // 縦位置
          let y = -halfY + j * interval;
          for (let k = 0; k <= countY; ++k) {
          // 奥行き
          let z = -halfZ + k * interval;
          verticesBase.push(x, y, z);
          size.push(5.0 * Math.random());
          colorsBase.push(200.0 * Math.random(), 200.0 * Math.random(), 200.0 * Math.random(), 1);
          }
        }
      }
      //https://threejs.org/docs/#api/en/core/bufferAttributeTypes/BufferAttributeTypes
      const vertices = new THREE.Float32BufferAttribute(verticesBase, 3);
      geometry.addAttribute('position', vertices);
      const sizes = new THREE.Float32BufferAttribute(size, 1);
      geometry.addAttribute('size', sizes);
      const colors = new THREE.Uint8BufferAttribute(colorsBase, 4);
      colors.normalized = true;
      geometry.addAttribute('color', colors);

      // Material
      //type参考
      //https://qiita.com/kitasenjudesign/items/1657d9556591284a43c8
      const uniforms = {
        time: {
          type: 'f',
          value: 0.0,
        }
      };

      meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });

      cloud = new THREE.Points(geometry, meshMaterial);
      cloud.name = "particles";
      scene.add(cloud);
    }

    function render(): void {
      nowTime = (Date.now() - startTime) / 1000;
      cloud.rotation.x = nowTime/3;
      cloud.rotation.y = nowTime/3;
      meshMaterial.uniforms.time.value = Math.sin(nowTime) * 3;
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
