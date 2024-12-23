import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';


function Ray() {


// 
  const selectCanvas3D = useRef();
  let camera, scene, renderer, controls, player;  // player 객체 추가
  const objects = [];  // 씬에 추가된 객체 배열

  let raycaster;
  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let canJump = true;

  let prevTime = performance.now();
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const vertex = new THREE.Vector3();
  const color = new THREE.Color();


  function init() {
    // 카메라 설정
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 10;  // 카메라 높이 설정

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);  // 배경색 검정
    scene.fog = new THREE.Fog(0x000000, 0, 250);  // 안개 설정

    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 2.5);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    // PointerLockControls 설정 (카메라와 플레이어 객체의 움직임 연결)
    controls = new PointerLockControls(camera, document.body);
    document.addEventListener('click', () => { controls.lock() });
    scene.add(controls.getObject());  // controls는 카메라 객체를 움직임

    // 바닥 (Floor) 정의 전에 floorGeometry 설정
    let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 1000, 100);
    floorGeometry.rotateX(-Math.PI / 2);

    // 텍스처 적용하기 
    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load('/textures/hardwood2_diffuse.jpg');
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture,   // 텍스처 적용
      roughness: 0.6,
      metalness: 0.2,
      flatShading: true
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);
    objects.push(floor);  // objects 배열에 floor 추가



    const loader = new FBXLoader();
    loader.load('/fbx/kid2.fbx', function (object){
        object.scale.set(0.01,0.01,0.01);
        scene.add(object);
        player = object; //모델을 player 객체로 설정
    })

    // 3D 모델을 player로 추가
    player = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    player.position.y = 10;
    scene.add(player);  // 씬에 player 객체 추가

    // 키 이벤트 리스너 설정
    const onKeyDown = function (event) {
      switch (event.code) {
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
          if (canJump) velocity.y += 350;
          canJump = false;
          break;
        default:
      }
    }

    const onKeyUp = function (event) {
      switch (event.code) {
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

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

    // 렌더러 설정
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    selectCanvas3D.current.appendChild(renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();

    if (controls.isLocked) {
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

      if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
      if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

      if (onObject) {
        velocity.y = Math.max(0, velocity.y);
        canJump = true;
      }

      // 카메라와 player 객체의 위치를 동기화
      player.position.x += velocity.x * delta;
      player.position.z += velocity.z * delta;
      player.position.y += velocity.y * delta;

      // 카메라는 player 뒤에 위치하도록 설정
      camera.position.x = player.position.x;
      camera.position.z = player.position.z + 2;  // 카메라는 플레이어 객체 뒤에 위치 (2만큼 떨어짐)
      camera.position.y = player.position.y + 2;  // 카메라는 플레이어 위에 약간 띄워서 배치

      if (player.position.y < 10) {
        velocity.y = 0;
        player.position.y = 10;
        canJump = true;
      }
    }

    prevTime = time;
    renderer.render(scene, camera);
  }

  useEffect(() => {
    init();
    animate();
  }, []);

  return (
    <div id="select-canvas-3d" ref={selectCanvas3D}></div>
  );
}

export default Ray;
