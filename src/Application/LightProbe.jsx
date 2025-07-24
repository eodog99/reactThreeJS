

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function LightProbeExample() {
  const canvasRef = useRef();

  useEffect(() => {
    let cubeTextere;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);



    //1. 환경 맵 설정
    const loader = new THREE.CubeTextureLoader();
    //loader.setPath('/textures/cube/pisa');   // <--- 이거 떄문에 안떴음ㅜㅜ 
    cubeTextere = loader.load([
      '/textures/cube/pisa/px.png', // +X
      '/textures/cube/pisa/nx.png', // -X
      '/textures/cube/pisa/py.png', // +Y
      '/textures/cube/pisa/ny.png', // -Y
      '/textures/cube/pisa/pz.png', // +Z
      '/textures/cube/pisa/nz.png'  // -Z
    ]);

    scene.background = cubeTextere;

    // 2. 구체 생성
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 32); // 반지름 5, 32 세그먼트

    // 수정된 재질 설정: 투명하게 만들고 반사를 추가
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, // 기본 색상
      metalness: 0.1,  // 금속성 (반사도 낮춤)
      roughness: 0.05, // 표면의 거칠기 (매끄럽게 설정)
      envMap: cubeTextere, // 환경 맵을 반영
      transparent: true, // 투명 설정
      opacity: 0.7,      // 투명도 설정 (0.0 ~ 1.0)
      clearcoat: 1,      // 클리어코팅 효과 추가 (구체 표면이 유리처럼 반짝임)
      clearcoatRoughness: 0, // 클리어코팅의 거칠기 설정 (매끄럽게)
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // 3. 카메라 위치 설정
    camera.position.z = 15;

    // 4. 조명 설정
    const light = new THREE.AmbientLight(0x404040, 2); // 부드러운 배경 빛
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // 방향성 빛
    directionalLight.position.set(10, 10, 10).normalize();
    scene.add(directionalLight);


     // OrbitControls 설정 (선택 사항)
     const controls = new OrbitControls(camera, renderer.domElement);
     controls.enableDamping = true;
     controls.dampingFactor = 0.25;
     controls.screenSpacePanning = false;
 
  
    // 5. 애니메이션 루프
    function animate() {
    requestAnimationFrame(animate); // 애니메이션 루프의 재귀적인 호출
 
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

export default LightProbeExample;
