import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'; // FBXLoader 임포트
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function FBXModelLoader() {
    const canvasRef = useRef();
    useEffect(() => {
        // 카메라, 씬, 렌더러 설정
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        document.body.appendChild(renderer.domElement);
    // 조명 추가: 기본 Ambient Light
      const AmbientLight = new THREE.AmbientLight(0xffffff, 200, 100); // Ambient Light 추가
      AmbientLight.position.set(5,10,5);
      scene.add(AmbientLight);

        // 조명 추가: 기본 Ambient Light
        const Light = new THREE.PointLight(0xffffff, 100, 17); // Ambient Light 추가
        Light.position.set(5,10,5);
        Light.castShadow = true;
        scene.add(Light);

        // 바닥 생성 및 텍스처 적용
        const textureLoader = new THREE.TextureLoader();
        const floorTexture = textureLoader.load('/textures/hardwood2_diffuse.jpg');  // 텍스처 경로에 맞게 수정

        const floorMaterial = new THREE.MeshStandardMaterial({
            map: floorTexture,  // 텍스처 적용
            roughness: 0.6,
            metalness: 0.2,
        });

        const floorGeometry = new THREE.PlaneGeometry(10, 20, 200);  // 바닥 크기 설정
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;  // 바닥이 수평이 되도록 회전
        floor.receiveShadow = true;
        scene.add(floor);

        //FBXLoader 설정
        const loader = new FBXLoader();

        //FBX 모델 로드
        loader.load(
            '/fbx/kid2.fbx', // FBX 모델 파일 경로
            (object) => {
                //모델이 로드되면 씬에 추가
                scene.add(object);

                //모델의 위치 및 크기 조정(필요시, 생략가능)
                object.position.set(0, 0, 0);
                object.scale.set(0.01, 0.01, 0.01); // FBX 모델 크기 조정
                object.castShadow = true;
            }
        );

         // 카메라 위치 설정
        camera.position.x = 1;
        camera.position.y = 2;
        camera.position.z = 5;

    // OrbitControls 설정 (선택 사항)
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

  }, []);

  return <canvas ref={canvasRef} />;
}



export default FBXModelLoader;