let scene, camera, renderer, model;
let targetRotX = 0, targetRotY = 0, targetRotZ = 0;
let currentRotX = 0, currentRotY = 0, currentRotZ = 0;

// 阈值 & 阻尼系数
const ROTATION_THRESHOLD = 3; // 超过这个角度变化视为剧烈晃动
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
  const rawX = event.beta || 0;   // [-180, 180]
  const rawY = event.gamma || 0;  // [-90, 90]
  const rawZ = event.alpha || 0;  // [0, 360]

  // 如果角度变化过大，说明是剧烈抖动，不更新
  if (
    Math.abs(rawX - targetRotX * 180 / Math.PI) > ROTATION_THRESHOLD ||
    Math.abs(rawY - targetRotY * 180 / Math.PI) > ROTATION_THRESHOLD ||
    Math.abs(rawZ - targetRotZ * 180 / Math.PI) > ROTATION_THRESHOLD
  ) return;

  targetRotX = rawX * Math.PI / 180;
  targetRotY = rawY * Math.PI / 180;
  targetRotZ = rawZ * Math.PI / 180;
}

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    // 使用线性插值实现阻尼（平滑移动）
    currentRotX += (targetRotX - currentRotX) * DAMPING;
    currentRotY += (targetRotY - currentRotY) * DAMPING;
    currentRotZ += (targetRotZ - currentRotZ) * DAMPING;

    model.rotation.x = currentRotX;
    model.rotation.y = currentRotY;
    model.rotation.z = currentRotZ;
  }
  renderer.render(scene, camera);
}
