let scene, camera, renderer, model;
let rotationX = 0, rotationY = 0, rotationZ = 0;

init();
animate();

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
  rotationX = event.beta || 0;
  rotationY = event.gamma || 0;
  rotationZ = event.alpha || 0;
}

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.x += (rotationX * Math.PI / 180 - model.rotation.x) * 0.1;
    model.rotation.y += (rotationY * Math.PI / 180 - model.rotation.y) * 0.1;
    model.rotation.z += (rotationZ * Math.PI / 180 - model.rotation.z) * 0.1;
  }
  renderer.render(scene, camera);
}
