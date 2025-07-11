let scene, camera, renderer, model;
let targetRotX = 0, targetRotY = 0;
let currentRotX = 0, currentRotY = 0;

// 配置参数
const ROTATION_THRESHOLD = 2;     // 角度阈值，超过视为剧烈晃动
const DAMPING = 0.07;             // 阻尼系数
const MAX_ROT_X = Math.PI / 4;    // 最大X旋转角（上下）
const MAX_ROT_Y = Math.PI / 3;    // 最大Y旋转角（左右）

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
  const rawBeta = event.beta || 0;   // X轴：上下抬头（[-180, 180]）
  const rawGamma = event.gamma || 0; // Y轴：左右倾斜（[-90, 90]）

  const nextX = rawBeta * Math.PI / 180;
  const nextY = rawGamma * Math.PI / 180;

  // 抖动过滤（角度变化过大时忽略）
  if (Math.abs(nextX - targetRotX) * 180 / Math.PI > ROTATION_THRESHOLD ||
      Math.abs(nextY - targetRotY) * 180 / Math.PI > ROTATION_THRESHOLD) {
    return;
  }

  // 设置限制范围
  targetRotX = THREE.MathUtils.clamp(nextX, -MAX_ROT_X, MAX_ROT_X);
  targetRotY = THREE.MathUtils.clamp(nextY, -MAX_ROT_Y, MAX_ROT_Y);
}

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    // 应用阻尼插值
    currentRotX += (targetRotX - currentRotX) * DAMPING;
    currentRotY += (targetRotY - currentRotY) * DAMPING;

    model.rotation.x = currentRotX;
    model.rotation.y = currentRotY;
  }
  renderer.render(scene, camera);
}
