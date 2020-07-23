/* eslint-disable @typescript-eslint/no-use-before-define */
import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', () => {
  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer();
  /**
   * @type {Object}
   */
  const rendererSize = { w: 1024, h: 512 };
  renderer.setClearColor(new THREE.Color(0x000000));
  // レンダラーのサイズを設定
  renderer.setSize(rendererSize.w, rendererSize.h);

  // シーンを作成
  const scene = new THREE.Scene();
  /**
   * カメラを作成
   * @param {number} fov - 視野角 推奨 50
   * @param {number} aspect - アスペクト比 推奨 window.innerWidth/window.innerHeight
   * @param {number} near - カメラのどのくらい近くからThree.jsが描画を開始するか 推奨 0.1
   * @param {number} far - カメラからどのくらい遠くまで見えるか 推奨 2000
   */
  const camera = new THREE.PerspectiveCamera(
    50,
    rendererSize.w / rendererSize.h,
    0.1,
    2000
  );

  //カメラの位置
  camera.position.set(
    0,
    0,
    rendererSize.w / 2 / Math.tan((25 * Math.PI) / 180)
  );
  //全体をうつす時のカメラ位置 (height or width)/2/Math.tan(fov/2 * Math.PI/180)
  camera.lookAt(new THREE.Vector3());

  // canvasをbodyに追加
  const webglOutput = document.getElementById('js-webgl-output');
  webglOutput.appendChild(renderer.domElement);

  let mouse = [0.0, 0.0];
  webglOutput.addEventListener(
    'mousemove',
    (event) => {
      const windowWidth = window.innerWidth;
      const target = event.target as HTMLElement;
      const ratio = rendererSize.w / windowWidth;
      const targetHeight = target.clientHeight;
      const x = event.pageX * ratio;
      const y = targetHeight * ratio - event.pageY * ratio;
      mouse = [x, y];
    },
    false
  );

  /**
   * シェーダーの読み込み
   * @param {string} vsPath - 頂点シェーダファイル
   * @param {string} fsPath - フラグメントシェーダ
   * @param {function} callback
   */
  loadShaderSource(
    '/threejs/assets/shader/texture-fullsize/scene.vert',
    '/threejs/assets/shader/texture-fullsize/scene.frag',
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
    const verticesXYZ = [rendererSize.w, rendererSize.h, 0.0];
    for (let i = 0; i < 4; i++) {
      verticesXYZ.forEach(function (value, index) {
        if (i === 0 && index === 0) {
          verticesBase.push(-value);
        } else if (i === 2 && index !== 3) {
          verticesBase.push(-value);
        } else if (i === 3 && index === 1) {
          verticesBase.push(-value);
        } else {
          verticesBase.push(value);
        }
      });
    }

    //頂点を結ぶ順番
    //https://qiita.com/edo_m18/items/ea34ad77238d0caf5142
    const indice = [0, 2, 1, 1, 2, 3];
    //画像を貼る
    //https://www.nogson.blog/entry/2017/11/29/004757
    const uv = [0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0];

    //https://threejs.org/docs/#api/en/core/bufferAttributeTypes/BufferAttributeTypes
    const vertices = new THREE.Float32BufferAttribute(verticesBase, 3);
    geometry.addAttribute('position', vertices);
    const uvs = new THREE.Float32BufferAttribute(uv, 2);
    geometry.addAttribute('uv', uvs);
    const indices = new THREE.Uint32BufferAttribute(indice, 1);
    geometry.addAttribute('index', indices);

    // Material
    const loader = new THREE.TextureLoader();
    const texture = [];
    texture.push(
      loader.load('/threejs/assets/img/carousel01/02.jpg', onRender)
    );
    //type参考
    //https://qiita.com/kitasenjudesign/items/1657d9556591284a43c8
    function onRender(): void {
      const uniforms = {
        uTex: {
          type: 't',
          value: texture[0],
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2(rendererSize.w, rendererSize.h), //解像度はcanvasサイズでなく画像のサイズ
        },
        mouse: {
          type: 'v2',
          value: new THREE.Vector2(0, 0),
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

      function render(): void {
        meshMaterial.uniforms.mouse.value.x = mouse[0];
        meshMaterial.uniforms.mouse.value.y = mouse[1];
        renderer.render(scene, camera);

        requestAnimationFrame(render);
      }
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
