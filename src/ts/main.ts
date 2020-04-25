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
  const sphereGeometry = new THREE.SphereGeometry(250, 10, 10);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x0e7529,
    wireframe: true,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.z = -5;
  scene.add(sphere);

  // 平行光源を生成
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);

  const tick = (): void => {
    requestAnimationFrame(tick);

    sphere.rotation.x += 0.02;
    sphere.rotation.y += 0.02;

    // 描画
    renderer.render(scene, camera);
  };
  tick();
});
