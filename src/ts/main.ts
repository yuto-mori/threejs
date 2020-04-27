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
  const camera = new THREE.PerspectiveCamera(45, 600 / 600, 1, 10000);
  camera.position.set(0, 0, 1000);

  // 箱を作成
  const planeGeometry = new THREE.PlaneGeometry(500, 500, 10, 10);

  function createMesh(geom) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/threejs/assets/img/carousel01/01.jpg');
    const mat = new THREE.MeshBasicMaterial();
    mat.map = texture;

    const mesh = new THREE.Mesh(geom, mat);
    return mesh;
  }

  const plane = createMesh(planeGeometry);

  plane.position.z = 0;
  scene.add(plane);

  // 平行光源を生成
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);


  const tick = (): void => {
    requestAnimationFrame(tick);

    plane.rotation.x += 0.02;
    plane.rotation.y += 0.02;

    // 描画
    renderer.render(scene, camera);
  };
  tick();
});
