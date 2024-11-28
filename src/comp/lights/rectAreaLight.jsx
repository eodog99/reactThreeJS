import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function Light6() {

  const selectCanvas3D = useRef();
  let camera, scene, renderer, light;
  let cubeMat, floorMat;

  let previousShadowMap = false;

  const bulbLuminousPowers = {
    '110000 lm (1000W)': 110000,
    '3500 lm (300W)': 3500,
    '1700 lm (100W)': 1700,
    '800 lm (60W)': 800,
    '400 lm (40W)': 400,
    '180 lm (25W)': 180,
    '20 lm (4W)': 20,
    'Off': 0
  };

  const hemiLuminousIrradiances = {
    '0.0001 lx (Moonless Night)': 0.0001,
    '0.002 lx (Night Airglow)': 0.002,
    '0.5 lx (Full Moon)': 0.5,
    '3.4 lx (City Twilight)': 3.4,
    '50 lx (Living Room)': 50,
    '100 lx (Very Overcast)': 100,
    '350 lx (Office Room)': 350,
    '400 lx (Sunrise/Sunset)': 400,
    '1000 lx (Overcast)': 1000,
    '18000 lx (Daylight)': 18000,
    '50000 lx (Direct Sun)': 50000
  };


  //3D 객체생성
  const params = {
    shadows: true,
    exposure: 0.68,
    bulbPower: Object.keys(bulbLuminousPowers)[4],
    hemiIrradiance: Object.keys(hemiLuminousIrradiances)[0]
  }


  function init() {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.x = -4;
    camera.position.z = 4;
    camera.position.y = 2;

    scene = new THREE.Scene();

    const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
    const bulbMaterial = new THREE.MeshBasicMaterial({color: '#000000'});
    const bulbMesh = new THREE.Mesh(bulbGeometry, bulbMaterial);
    light = new THREE.RectAreaLight(0xffffbb, 10, 2, 2);
    light.position.set(-1, 1, 1);
    light.lookAt(0, 0, 0);
    // light.add(bulbMesh);
    scene.add(light);

    // hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
    // scene.add(hemiLight);

    floorMat = new THREE.MeshStandardMaterial({
      roughness: 0.8,
      color: 0xffffff,
      metalness: 0.2,
      bumpScale: 0.0005
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/textures/hardwood2_diffuse.jpg', function(map) {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.anisotoropy = 4;
      map.repeat.set(10, 24);
      map.colorSpace = THREE.SRGBColorSpace;
      floorMat.map = map;
      floorMat.needsUpdate = true;
    });
    textureLoader.load('/textures/hardwood2_bump.jpg', function(map) {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.anisotoropy = 4;
      map.repeat.set(10, 24);
      floorMat.bumpMap = map;
      floorMat.needsUpdate = true;
    });
    textureLoader.load('/textures/hardwood2_roughness.jpg', function(map) {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set(10, 24);
      floorMat.roughnessMap = map;
      floorMat.needsUpdate = true;
    });

    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
    floorMesh.receiveShadow = true;
    floorMesh.rotation.x = -Math.PI / 2.0;
    scene.add(floorMesh);

    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      matalness: 1.0,
    });
    const ballGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const ballMesh = new THREE.Mesh(ballGeometry, ballMat);
    ballMesh.position.set(1, 0.25, 1);
    ballMesh.rotation.y = Math.PI;
    ballMesh.castShadow = true;
    scene.add(ballMesh);

    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      matalness: 1.0,
    });
    const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const boxMesh = new THREE.Mesh(boxGeometry, boxMat);
    boxMesh.position.set(-0.5, 0.25, -1);
    boxMesh.castShadow = true;
    scene.add(boxMesh);

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    selectCanvas3D.current.appendChild(renderer.domElement);

    const orbitControls = new OrbitControls(camera, renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    renderer.toneMappingExposure = Math.pow(params.exposure, 5.0);
    renderer.shadowMap.enabled = params.shadows;

    if(params.shadows !== previousShadowMap) {
      // ballMat.needsUpdate = true;
      // cubeMat.needsUpdate = true;
      // floorMat.needsUpdate = true;
      previousShadowMap = params.shadows;
    }

    const time = Date.now() * 0.0005;

    renderer.render(scene, camera);
  }

  


  useEffect(() => {
    init();
    animate();
  }, []);
  return (
    <div id="select-canvas-3d" ref={selectCanvas3D}>
  </div>)
}

export default Light6;