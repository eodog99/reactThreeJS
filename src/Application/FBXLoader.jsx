import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function FBXModelLoader() {
  const canvasRef = useRef();
  const objectRef = useRef(null); // 오타 수정: objectFef -> objectRef

  useEffect(() => {

    // 카메라, 씬, 렌더러 설정
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // 그림자 활성화
    renderer.shadowMap.type = THREE.PCFShadowMap; // 그림자 품질 설정
    document.body.appendChild(renderer.domElement);

    // 조명 추가 : 기본 Ambient Light
    const AmbientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(AmbientLight);

    // 조명 추가: Point Light 추가
    const Light = new THREE.PointLight(0xffffff, 100, 10); 
    Light.position.set(1, 4, 3);
    Light.castShadow = true; // 그림자 생성 가능
    scene.add(Light);

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

    // FBXLoader 설정
    const loader = new FBXLoader();

    // FBX 모델 로드
    loader.load(
      '/fbx/kid2.fbx', // FBX 모델 파일 경로
      (object) => {
        // 모델이 로드되면 씬에 추가
        scene.add(object);

        // objectRef.current에 객체를 저장
        objectRef.current = object;

        // 모델의 위치 및 크기 조정(필요시, 생략 가능)
        object.position.set(0, 0, 0);
        object.scale.set(0.05, 0.05, 0.05); // FBX 모델 크기 조정
        object.castShadow = true; // 모델이 그림자를 생성하도록 설정
        console.log("text1 : " + objectRef)
        // Light의 target을 objectRef.current로 설정(정확한 대상지정..인데 왜 안뜰까!)
        Light.target = objectRef.current;
      }
    );
    console.log("text : " + objectRef)

    // 카메라 위치 설정
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;

    // OrbitControls 설정
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    // 애니메이션 루프
    function animate() {
      requestAnimationFrame(animate);
      controls.update(); // OrbitControls 업데이트
      renderer.render(scene, camera);
    }

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

export default FBXModelLoader;
