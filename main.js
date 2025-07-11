import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, model;
let targetRotX = 0, targetRotY = 0;
let currentRotX = 0, currentRotY = 0;

const MAX_ROT_X = Math.PI / 12;  // 15°
const MAX_ROT_Y = Math.PI / 12;  // 15°
const DAMPING = 0.1;

window.onload = function () {
  init();
  animate();
};

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  scene.add(light);

  // 加载 GLB 模型，备用（也可替换为自定义模型）
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshNormalMaterial();
  model = new THREE.Mesh(geometry, material);
  scene.add(model);

  document.getElementById('btn').addEventListener('click', () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(response => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      }).catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function handleOrientation(event) {
  const beta = event.beta || 0;
  const gamma = event.gamma || 0;

  const factorX = THREE.MathUtils.clamp(beta / 30, -1, 1);
  const factorY = THREE.MathUtils.clamp(gamma / 30, -1, 1);

  targetRotX = factorX * MAX_ROT_X;
  targetRotY = factorY * MAX_ROT_Y;
}

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    currentRotX += (targetRotX - currentRotX) * DAMPING;
    currentRotY += (targetRotY - currentRotY) * DAMPING;
    model.rotation.x = currentRotX;
    model.rotation.y = currentRotY;
  }
  renderer.render(scene, camera);
}
