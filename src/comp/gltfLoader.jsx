import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function ModelLoader() {
  const canvasRef = useRef();

  useEffect(() => {
    // 씬, 카메라, 렌더러 설정
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // 그림자 활성화
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자 품질 향상
    document.body.appendChild(renderer.domElement);

    // 조명 추가: 기본 Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Ambient Light 추가
    scene.add(ambientLight);

    // 조명 추가 : Directional Light 추가 (빛의 방향을 설정하여 그림자 효과 향상)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5); // 빛의 방향 설정
    directionalLight.castShadow = true; // 그림자 생성 가능
    directionalLight.shadow.mapSize.width = 2048;  // 그림자 품질 향상
    directionalLight.shadow.mapSize.height = 2048; // 그림자 품질 향상
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // OrbitControls 설정 (마우스로 씬을 회전시키기 위해)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;  // 부드러운 회전
    controls.dampingFactor = 0.25;  // 회전 속도 조정
    controls.screenSpacePanning = false;  // 카메라가 화면에 평행하게 움직이지 않게
    controls.maxPolarAngle = Math.PI / 2;  // 카메라가 수평선 아래로 내려가지 않도록 제한

    // 바닥 생성 및 텍스처 적용
    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load('/textures/hardwood2_diffuse.jpg'); // 텍스처 경로에 맞게 수정
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.6,
      metalness: 0.2,
    });

    const floorGeometry = new THREE.PlaneGeometry(30, 30, 20); // 바닥 크기 설정
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // 바닥이 수평이 되도록 회전
    floor.receiveShadow = true; // 바닥이 그림자를 받도록 설정
    scene.add(floor);

    // GLTFLoader 설정
    const loader = new GLTFLoader();

    // 모델 로드
    loader.load(
      '/gltf/oil_can/scene.gltf', // 모델 파일 경로
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        
        // 모델 그림자 설정
        model.castShadow = true; // 모델이 그림자를 만들도록 설정
        model.receiveShadow = true; // 모델이 그림자를 받을 수 있도록 설정

        // 모델 위치 조정
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);  // 모델 크기 조정 (필요하면 변경)
      }
    );


    // 카메라 위치 설정
    camera.position.z = 4;

    // 애니메이션 루프
    function animate() {
      requestAnimationFrame(animate);
      controls.update(); // OrbitControls 업데이트
      renderer.render(scene, camera);
      
    }
    console.log("test1: "+ scene[3])
    animate();

    // 윈도우 리사이즈 대응
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
    });
  }, []); // 빈 배열로 useEffect가 한 번만 실행되도록

  return <canvas ref={canvasRef} />;
}

export default ModelLoader;
