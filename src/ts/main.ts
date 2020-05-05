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
    // https://threejs.org/docs/#api/en/core/BufferGeometry
    // https://qiita.com/kitasenjudesign/items/1657d9556591284a43c8
    // シェーダに送れるデフォルトの値
    // position, faceIndex, normal, color, uv, uv2
    const geometry = new THREE.BufferGeometry();
    const verticesBase = [];
    const colorsBase = [];
    const uv = []; // 画像の頂点の色を取得する
    const size = [];
    const width = 512;
    const height = 256;
    const halfX = width / 2.0;
    const halfY = height / 2.0;
    const interval = 0.8;
    const countX = width / interval;
    const countY = height / interval;
    for (let i = 0; i <= countX; ++i) {
      // 横位置
      const x = -halfX + i * interval;
      for (let j = 0; j <= countY; ++j) {
        // 縦位置
        let y = -halfY + j * interval;
        verticesBase.push(x, y, 0);
        uv.push(i / countX, j / countY);
        size.push(1.0);
        colorsBase.push(255.0, 255.0, 255.0, 1);
      }
    }
    //https://threejs.org/docs/#api/en/core/bufferAttributeTypes/BufferAttributeTypes
    const vertices = new THREE.Float32BufferAttribute(verticesBase, 3);
    geometry.addAttribute('position', vertices);
    const uvs = new THREE.Float32BufferAttribute(uv, 2);
    geometry.addAttribute('uv', uvs);
    const sizes = new THREE.Float32BufferAttribute(size, 1);
    geometry.addAttribute('size', sizes);
    const colors = new THREE.Uint8BufferAttribute(colorsBase, 4);
    colors.normalized = true;
    geometry.addAttribute('color', colors);

    // Material
    const loader = new THREE.TextureLoader();
    const texture = [];
    texture.push(
      loader.load('/threejs/assets/img/carousel01/01.jpg', onRender),
      loader.load('/threejs/assets/img/carousel01/02.jpg'),
      loader.load('/threejs/assets/img/carousel01/03.jpg')
    );

    //type参考
    //https://qiita.com/kitasenjudesign/items/1657d9556591284a43c8
    function onRender(): void {
      const uniforms = {
        uTex: {
          type: 't',
          value: texture[0],
        },
        time: {
          type: 'f',
          value: 0.0,
        },
      };

      const meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });

      const cloud = new THREE.Points(geometry, meshMaterial);
      scene.add(cloud);
    
      //let step = 0;
      render();

      const startTime = Date.now();
      let nowTime = 1;
      let imageNum = 0;
      let flag = false;

      function render(): void {
        //nowTime = (Date.now() - startTime) / 1000;
        //cloud.rotation.y += 0.01;
        //シェーダにデータを送る
        meshMaterial.uniforms.time.value = Math.sin(nowTime) * 10;

        if (Math.sin(nowTime) * 10 < 1 && Math.sin(nowTime) * 10 > -1) {
          //nowtimeが1以下になったら、いったん画像を止めて見せる
          setTimeout(render, 150);
          meshMaterial.uniforms.time.value = 1;
          flag = true;
        } else if (
          Math.sin(nowTime) * 10 > 9.999 ||
          Math.sin(nowTime) * 10 < -9.999
        ) {
          //nowtimeが9.999以上、nowtimeが-9.999以下になったら、いったん画像を変更
          setTimeout(render, 30);
          meshMaterial.uniforms.uTex.value = texture[imageNum];
          if (flag) {
            imageNum += 1;
            imageNum = imageNum % 3;
            flag = false;
          }
        } else {
          //上記意外のときは0.03のスピードでrender関数を更新
          setTimeout(render, 30);
        }
        nowTime += 0.01;
        renderer.render(scene, camera);
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
