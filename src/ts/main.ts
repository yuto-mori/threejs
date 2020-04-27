import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', () => {
  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer();
  // レンダラーのサイズを設定
  renderer.setSize(600, 600);
  // canvasをbodyに追加
  document.getElementById('js-webgl-output').appendChild(renderer.domElement);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, 600 / 600, 0.1, 2000);
  camera.position.set(0, 0, 1000);

  // 平行光源を生成
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);

  // 箱を作成
  const planeGeometry = new THREE.PlaneGeometry(500, 500, 500, 500);

  function createMesh(geom) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      '/threejs/assets/img/carousel01/01.jpg',
      function(){
        const mat = new THREE.MeshBasicMaterial();
        mat.map = texture;
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.z = 0;
        scene.add(mesh);
        renderer.render(scene, camera);
      }
      );
  }

  const plane = createMesh(planeGeometry);

});
