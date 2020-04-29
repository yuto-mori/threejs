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
    const geometry = new THREE.BufferGeometry();
    const verticesBase = [];
    for (let i = 0; i < 5000; i++) {
      const x = Math.floor(Math.random() * 1000 - 500);
      const y = Math.floor(Math.random() * 1000 - 500);
      const z = Math.floor(Math.random() * 1000 - 500);
      verticesBase.push(x, y, z);
    }
    const vertices = new Float32Array(verticesBase);
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const uniforms = {
      size: {
        type: 'f',
        value: 10.0,
      },
    };

    const meshMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
    });

    const cube = new THREE.Points(geometry, meshMaterial);

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
