import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function Light() {

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

  const params = {
    shadows: true,
    exposure: 0.68,
    bulbPower: Object.keys(bulbLuminousPowers)[4],
    hemiIrradiance: Object.keys(hemiLuminousIrradiances)[0]
  };


// three.js 초기화 
// 카메라 PerspectiveCamera를 사용하여 3D 씬을 볼 카메라를 설정한다.
  function init() {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.x = -4;
    camera.position.z = 4;
    camera.position.y = 2;

    scene = new THREE.Scene(); // Three.js의 장면을 설정한다.

    const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
    const bulbMaterial = new THREE.MeshBasicMaterial({color: '#000000'});
    const bulbMesh = new THREE.Mesh(bulbGeometry, bulbMaterial);
    light = new THREE.AmbientLight(0xffffff, 30);
    scene.add(light);


    // 바닥에 적용할 재질
    floorMat = new THREE.MeshStandardMaterial({
      roughness: 0.8,
      color: 0xffffff,
      metalness: 0.2,
      bumpScale: 0.0005
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('texture/hardwood2_diffuse.jpg', function(map) {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.anisotoropy = 4;
      map.repeat.set(10, 24);
      map.colorSpace = THREE.SRGBColorSpace;
      floorMat.map = map;
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
      metalness: 1.0,
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
      metalness: 1.0,
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

    // OrbitControls 추가
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true; // 부드러운 조정
    orbitControls.dampingFactor = 0.25;
    orbitControls.screenSpacePanning = false; // 화면 공간에서 팬을 비활성화

    // 애니메이션 루프에서 controls.update() 호출
    function animate() {
      requestAnimationFrame(animate);
      orbitControls.update();  // OrbitControls 업데이트

      render();
    }

    animate();
  }


  //렌더링
  function render() {
    renderer.toneMappingExposure = Math.pow(params.exposure, 5.0);
    renderer.shadowMap.enabled = params.shadows;

    const time = Date.now() * 0.0005;

    renderer.render(scene, camera);
  }

  //useEffect() : 이 훅은 컴포넌트가 마운트될 때 init을 호출하여 Three.js초기화 작업을 수행한다.
  useEffect(() => {
    init();
  }, []);

  return (
      <div id="select-canvas-3d" ref={selectCanvas3D}></div>
  );
}

export default Light;
