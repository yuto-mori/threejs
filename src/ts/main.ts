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

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, 600 / 600, 1, 2000);
  camera.position.set(0, 0, 120);

  // canvasをbodyに追加
  document.getElementById('js-webgl-output').appendChild(renderer.domElement);

  loadShaderSource(
    '/threejs/assets/shader/scene.vert',
    '/threejs/assets/shader/scene.frag',
    (shader) => {
      const vertexShader = shader.vs;
      const fragmentShader = shader.fs;
      init(vertexShader, fragmentShader);
    }
  );

  function init(vertexShader, fragmentShader): void {
    const cubeGeometry = new THREE.PlaneGeometry(100, 100);

    const uniforms = {
      time: { type: 'f', value: 0.2 },
      scale: { type: 'f', value: 0.2 },
      alpha: { type: 'f', value: 0.6 },
      resolution: { type: 'v2', value: new THREE.Vector2() },
    };

    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;

    const meshMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
    });

    const cube = new THREE.Mesh(cubeGeometry, meshMaterial);

    scene.add(cube);

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
