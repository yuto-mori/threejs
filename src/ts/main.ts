/* eslint-disable @typescript-eslint/no-use-before-define */
// npm の入れ方などはここを公式を参考
// https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './libs/postprocessing/RenderPass.js';
import { CopyShader } from './libs/shaders/CopyShader.js';
import { ShaderPass } from './libs/postprocessing/ShaderPass.js';
import { CustomGrayScaleShader } from './shader/shader.js';

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
  camera.position.set(0, 0, 10);

  // canvasをbodyに追加
  document.getElementById('js-webgl-output').appendChild(renderer.domElement);

  const renderPass = new RenderPass(scene, camera);
  const effectCopy = new ShaderPass(CopyShader);
  effectCopy.renderToScreen = true;
  const shaderPass = new ShaderPass(CustomGrayScaleShader);
  shaderPass.enabled = false;

  const composer = new EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(effectCopy);
  composer.addPass(shaderPass);

  const grayScale = true;
  const rPower = 0.2126;
  const gPower = 0.7152;
  const bPower = 0.0722;
  shaderPass.enabled = grayScale;
  shaderPass.uniforms.rPower.value = rPower;
  shaderPass.uniforms.gPower.value = gPower;
  shaderPass.uniforms.bPower.value = bPower;

  // 平行光源を生成
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);

  //画像を読み込む
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(
    '/threejs/assets/img/carousel01/01.jpg',
    onRender
  );

  function onRender(): void {
    const createParticles = (): void => {
      const geom = new THREE.Geometry();
      const material = new THREE.PointsMaterial({
        size: 20,
        color: 0xffffff,
        map: texture,
      });

      for (let x = -4; x < 4; x++) {
        for (let y = -2; y < 2; y++) {
          const particle = new THREE.Vector3(x * 10, y * 10, 0);
          geom.vertices.push(particle);
        }
      }
      const cloud = new THREE.Points(geom, material);
      scene.add(cloud);
    };
    createParticles();
    //renderer.render(scene, camera);
    composer.render();
  }
});
