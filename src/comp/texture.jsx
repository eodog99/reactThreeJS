import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function TexturedCube() {
  const canvasRef = useRef();

  useEffect(() => {
    let camera, scene, renderer;
    let mesh;

    function init() {
      // 카메라 설정
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 5;

      // 씬 설정
      scene = new THREE.Scene();

      // 텍스처 로드 (경로 수정)
      const texture = new THREE.TextureLoader().load('/textures/earth_atmos_2048.jpg'); // 텍스처 경로 수정

      // 큐브 기하학과 텍스처를 적용한 재질
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ map: texture });

      // 큐브 메시 생성 및 씬에 추가
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // 렌더러 설정
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      // 애니메이션 루프 설정
      function animate() {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(animate); // 애니메이션 루프
      }

      animate(); // 애니메이션 시작

      // 윈도우 크기 변경 시 렌더러와 카메라 크기 조정
      window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    init(); // 초기화 함수 호출

    return () => {
      window.removeEventListener('resize', onWindowResize); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

export default TexturedCube;
