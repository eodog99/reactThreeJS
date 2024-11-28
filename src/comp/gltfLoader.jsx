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
    document.body.appendChild(renderer.domElement);

    // 조명 추가: 기본 Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Ambient Light 추가
    scene.add(ambientLight);


    // OrbitControls 설정 (마우스로 씬을 회전시키기 위해)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;  // 부드러운 회전
    controls.dampingFactor = 0.25;  // 회전 속도 조정
    controls.screenSpacePanning = false;  // 카메라가 화면에 평행하게 움직이지 않게
    controls.maxPolarAngle = Math.PI / 2;  // 카메라가 수평선 아래로 내려가지 않도록 제한

    // GLTFLoader 설정
    const loader = new GLTFLoader();

    // 모델 로드
    loader.load(
      '/gltf/oil_can/scene.gltf', // 모델 파일 경로
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        
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

      // 모델 애니메이션 처리 (있는 경우)
      scene.traverse((child) => {
        if (child.isMesh) {
          child.rotation.x += 0.001;
          child.rotation.y += 0.01;
        }
      });

      renderer.render(scene, camera);
    }

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
}

export default ModelLoader;
