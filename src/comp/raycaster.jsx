import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import  "./css/style.css";



function Player() {



  // 상수 및 변수 설정
  const selectCanvas3D = useRef(); // 3D 캔버스를 참조하는 useRef
  let camera, scene, renderer, controls; //Three.js에서 사용하는 주요 객체들로 각각 카메라 씬 렌더러 플레이어 이동을 제어하는 컨트롤을 나타냄
  const objects =[]; //씬에 추가된 3D 객체들을 저장하는 배열이다.

  let raycaster; 

  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let canJump = false;

  let prevTime = performance.now();
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const vertex = new THREE.Vector3();
  const color = new THREE.Color();


  // init() 함수 : 초기화
  function init() {
    //카메라 설정
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 10; //카메라 높이 설정

    //씬 설정
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); //베경색 검정으로 설정
    scene.fog = new THREE.Fog(0x000000, 0, 250); // 안개 설정

    //조명 설정
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 2.5);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);


    //PointerLockControls 설정(마우스를 화면에 고정)
    controls = new PointerLockControls(camera, document.body);
    document.addEventListener('click', () => {controls.lock()});
    scene.add(controls.getObject()); //플레이어 위치를 제어하는 객체

    //키 이벤트 리스너 설정
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

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, -0), 0, 10);

    //floor
    let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 1000, 100);
    floorGeometry.rotateX(-Math.PI / 2);

    // vertex displacement
    let position = floorGeometry.attributes.position;

    for(let i = 0, l = position.count; i < l; i++) {
      vertex.fromBufferAttribute(position, i);
      
      vertex.x += Math.random() * 20 - 10;
      vertex.y += Math.random() * 2;
      vertex.z += Math.random() * 20 - 10;

      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }


    floorGeometry = floorGeometry.toNonIndexed();
    
    position = floorGeometry.attributes.position;
    const colorsFloor = [];

    for(let i = 0, l = position.count; i < l; i++) {
      // color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace);
      color.setHex('888888');
      colorsFloor.push(color.r, color.g, color.b);
    }

    floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsFloor, 3));

    const floorMaterial = new THREE.MeshBasicMaterial({vertexColors: true});
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);

    // objects
    const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();
    position = boxGeometry.attributes.position;
    const colorsBox = [];
    for(let i = 0, l = position.count; i < l; i++) {
      color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace);
      colorsBox.push(color.r, color.g, color.b);
    }

    boxGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsBox, 3));


    // 여러 개의 박스 객체 생성 후 씬에 추가
    for(let i = 0; i < 500; i++) {
      const boxMaterial = new THREE.MeshPhongMaterial({specular: 0xffffff, flatShading: true, vertexColors: true});
      boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace);

      const box = new THREE.Mesh(boxGeometry, boxMaterial);
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


  // 애니메이션 함수 : animate()
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

  

// 리액트의 useEffect 사용
  useEffect(() => {
    init();
    animate();
  }, []);
  return (
    <div id="select-canvas-3d" ref={selectCanvas3D}>

    </div>
  )
}

export default Player;