import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function Light5() {


  //기본 설정
  //selectCanvas3D: useRef()를 사용하여 3D 씬이 렌더링될 HTML 요소를 참조합니다.
  const selectCanvas3D = useRef();
  let camera, scene, renderer, bulbLight, bulbMat, hemiLight;
  let ballMat, cubeMat, floorMat;

  let previousShadowMap = false;


  //bulbLuminousPowers는 전구의 밝기(Lumen)
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
//hemiLuminousIrradiances는 주변 조명의 밝기(lux)를 정의
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

//params: 이 객체는 몇 가지 기본 설정을 포함합니다. 예를 들어, bulbPower는 기본적으로 60W 전구로 설정됩니다. 
//이 값을 변경하면 전구의 밝기가 조정됩니다.
  const params = {
    shadows: true,
    exposure: 0.68,
    bulbPower: Object.keys(bulbLuminousPowers)[4],// 기본 설정: 60W 전구
    hemiIrradiance: Object.keys(hemiLuminousIrradiances)[0]// 기본 설정: Moonless Night
  }


  //이 함수는 3D씬의 초기화 작업을 담당한다.
  function init() {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.x = -4;
    camera.position.z = 4;
    camera.position.y = 2;

    scene = new THREE.Scene();


    //PointLight를 사용하여 전구와 같은 점 광원(Point Light)을 만듭니다. 
    //전구는 색상 0xffee88을 가지며, emissive 재질로 발광 효과를 구현합니다. 
    //castShadow가 true로 설정되어 있어 이 전구는 그림자를 발생시킵니다.
    const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
    bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);
    bulbMat = new THREE.MeshStandardMaterial({
      emissive: 0xffffee,
      emissiveIntensity: 1,
      color: 0x000000
    });
    bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
    bulbLight.position.set(0, 2, 0);
    bulbLight.castShadow = true;
    scene.add(bulbLight);

    //해피스피어 라이트 : HemisphereLight는 상반부와 하반부에 다른 색상의 빛을 발하는 조명임
    hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
    scene.add(hemiLight);

    // 바닥재질
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
    textureLoader.load('texture/hardwood2_bump.jpg', function(map) {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.anisotoropy = 4;
      map.repeat.set(10, 24);
      floorMat.bumpMap = map;
      floorMat.needsUpdate = true;
    });
    textureLoader.load('texture/hardwood2_roughness.jpg', function(map) {
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


    //구체와 상자 추가
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
//OrbitControls: 이 컨트롤을 사용하여 마우스로 씬을 회전하거나 확대/축소할 수 있습니다.
    const orbitControls = new OrbitControls(camera, renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    renderer.toneMappingExposure = Math.pow(params.exposure, 5.0);
    renderer.shadowMap.enabled = params.shadows;
    bulbLight.castShadow = params.shadows;

    if(params.shadows !== previousShadowMap) {
      // ballMat.needsUpdate = true;
      // cubeMat.needsUpdate = true;
      // floorMat.needsUpdate = true;
      previousShadowMap = params.shadows;
    }

    bulbLight.power = bulbLuminousPowers[params.bulbPower];
    bulbMat.emissiveIntensity = bulbLight.Intensity / Math.pow(0.02, 2.0);

    hemiLight.intensity = hemiLuminousIrradiances[params.hemiIrradiance];
    const time = Date.now() * 0.0005;

    bulbLight.position.y = Math.cos(time) * 0.75 + 1.25;
    renderer.render(scene, camera);
  }

  


  useEffect(() => {
    init();
    animate();
  }, []);
  return (<div>
    <div id="select-canvas-3d" ref={selectCanvas3D}>

    </div>
  </div>)
}

export default Light5;