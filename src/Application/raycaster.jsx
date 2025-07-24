

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';



function Player() {


  //상수 및 변수 설정
  const selectCanvas3D = useRef(); // 3D 캔버스를 참조하는 useRef
  let camera, scene, renderer, controls; //각각 카메라 씬 렌더러 플레이어 이동을 제어하는 컨트롤을 나타냄
  const objects =[]; //씬에 추가된 3D 객체들을 저장하는 배열이다.
  let raycaster; 

  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let canJump = false;


  let prevTime = performance.now();  // performance.now() : 마이크로초 단위의 짧은 시간 간격을 측정하는데 유용하다.
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const vertex = new THREE.Vector3();
  const color = new THREE.Color();


  // 초기화 함수 init()
  function init() {
    //카메라 설정
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 10; //카메라 높이 설정

    //씬 설정: 씬을 초기화하고 배경 색상 및 안개를 설정
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); //베경색 검정으로 설정
    scene.fog = new THREE.Fog(0x000000, 0, 250); // 안개 설정

    //조명 설정: 환경광을 설정하여 씬에 빛을 추가
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 2.5);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);


    //PointerLockControls 설정: 마우스를 화면에 고정
    controls = new PointerLockControls(camera, document.body);
    document.addEventListener('click', () => {controls.lock()});
    scene.add(controls.getObject()); //플레이어 위치를 제어하는 객체

    //키 이벤트 리스너 설정: WASD와 화살표 키로 플레이어 이동을 제어
    const onKeyDown = function (event) {
      switch(event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward = true; break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft = true; break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward = true; break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight = true; break;
        case 'Space':
          if(canJump) velocity.y += 350;
          canJump = false;
          break;
        default:
      }
    }

    const onKeyUp = function (event) {
      switch(event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward = false; break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft = false; break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward = false; break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight = false; break;
        default:
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Raycaster 설정: 플레이어가 바닥에 있는지 확인하기 위해 사용
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, -0), 0, 10);

    // 바닥 생성: PlaneGeometry로 바닥을 만든 후 랜덤한 높이와 위치로 변형
    let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 1000, 100);
    floorGeometry.rotateX(-Math.PI / 2);

    // 바닥에 랜덤 범위 추가: 바닥에 변화를 주어 자연스러운 느낌을 추가 
    let position = floorGeometry.attributes.position;

    for(let i = 0, l = position.count; i < l; i++) {
      vertex.fromBufferAttribute(position, i);
      
      vertex.x += Math.random() * 20 - 10;
      vertex.y += Math.random() * 2;
      vertex.z += Math.random() * 20 - 10;

      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    // 색상 설정: 바닥에 색상을 추가
    floorGeometry = floorGeometry.toNonIndexed();
    position = floorGeometry.attributes.position;
    const colorsFloor = []; // 바닥 색상 배열

    for(let i = 0, l = position.count; i < l; i++) {
      color.setHex('888888'); //바닥 색상을 회색으로 설정
      colorsFloor.push(color.r, color.g, color.b); // RGB 값 배열에 추가
    }

    floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsFloor, 3)); // 색상 속성 추가
    const floorMaterial = new THREE.MeshBasicMaterial({vertexColors: true}); // 색상을 버텍스 색상으로 적용
    const floor = new THREE.Mesh(floorGeometry, floorMaterial); // 바닥 메시 생성
    scene.add(floor); // 씬에 바닥 추가

    // 여러 개의 박스를 생성하여 씬에 추가
    const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();
    position = boxGeometry.attributes.position;
    const colorsBox = []; // 박스 색상 배열 

    // 각 박스의 색상을 랜덤하게 설정
    for(let i = 0, l = position.count; i < l; i++) {
      color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace);
      colorsBox.push(color.r, color.g, color.b);
    }

    boxGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsBox, 3));


    // 여러 개의 박스를 랜덤 위치에 배치하여 씬에 추가
    for(let i = 0; i < 500; i++) {
      const boxMaterial = new THREE.MeshPhongMaterial({specular: 0xffffff, flatShading: true, vertexColors: true});
      boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace);

      const box = new THREE.Mesh(boxGeometry, boxMaterial);

      // 박스 랜덤 위치 설정
      box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
      box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
      box.position.z = Math.floor(Math.random() * 20 - 10) * 20;

      scene.add(box);
      objects.push(box);
    }
    //렌더러 설정
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  }


  //3. 애니메이션 함수 : animate()
  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();

    if(controls.isLocked) {
      raycaster.ray.origin.copy(controls.getObject().position);
      raycaster.ray.origin.y -= 10;
  
      const intersections = raycaster.intersectObjects(objects, false);
      const onObject = intersections.length > 0;
      const delta = (time - prevTime) / 1000;
  
      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      velocity.y -= 9.8 * 100.0 * delta;
  
      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize();
  
      if(moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
      if(moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
  
      if(onObject) {
        velocity.y = Math.max(0, velocity.y);
        canJump = true;
      }
  
      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);
  
      controls.getObject().position.y += (velocity.y * delta);
  
      if(controls.getObject().position.y < 10) {
        velocity.y = 0;
        controls.getObject().position.y = 10;
  
        canJump = true;
      }
    }

    prevTime = time;

    renderer.render(scene, camera);
  }

  

// React useEffect 사용

  useEffect(() => {
    init();
    animate();
  }, []);

  //렌더링

  return (
    <div id="select-canvas-3d" ref={selectCanvas3D}>

    </div>
  )
}

export default Player;