import * as THREE from 'three';

window.addEventListener('load', () => {
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

  const createParticles = (): void => {
    const geom = new THREE.Geometry();
    const material = new THREE.PointsMaterial({
      size: 20,
      vertexColors: true,
      color: 0xffffff,
    });

    for (let x = -15; x < 15; x++) {
      for (let y = -15; y < 15; y++) {
        const particle = new THREE.Vector3(x * 20, y * 20, 0);
        geom.vertices.push(particle);
        geom.colors.push(new THREE.Color(Math.random() * 0x00ffff));
      }
    }
    const cloud = new THREE.Points(geom, material);
    scene.add(cloud);
  };
  createParticles();
  renderer.render(scene, camera);
});
