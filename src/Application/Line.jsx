import { useRef, useEffect } from "react";
import * as THREE from 'three';

function Line() {
  const selectCanvas3D = useRef();

  function init() {
    // 씬, 카메라, 렌더러 설정
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    selectCanvas3D.current.appendChild(renderer.domElement);

    // 라인 점들 설정
    const points = [];
    // THREE.Vector3(x, y, z)는 3D 공간에서의 점을 정의하는 객체다.
    points.push(new THREE.Vector3(-1, 0, 0));
    points.push(new THREE.Vector3(1, 0, 0));

    // Geometry 설정
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Material 설정(선의 색상)
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

    // Line 객체 생성
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // 카메라 위치 설정
    camera.position.z = 5; // 카메라 z축 위치를 5로 설정

    // 애니메이션 루프
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }

  // useEffect 훅: 컴포넌트가 마운트될 때 init을 호출하여 초기화
  useEffect(() => {
    init();
  }, []);

  return <div ref={selectCanvas3D}></div>;
}

export default Line;
