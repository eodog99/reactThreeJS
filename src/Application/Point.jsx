import { useRef, useEffect } from "react";
import * as THREE from 'three';

function Point() {
  const selectCanvas3D = useRef();

  function init() {
    // 씬, 카메라, 렌더러 설정
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    selectCanvas3D.current.appendChild(renderer.domElement);

     // 점들의 배열
     const points = [];
     for (let i = 0; i < 1000; i++) {
       points.push(new THREE.Vector3(
         (Math.random() - 0.5) * 10, // x
         (Math.random() - 0.5) * 10, // y
         (Math.random() - 0.5) * 10  // z
       ));
     }
   
    // Geometry 설정 (점들의 배열을 BufferGeometry로 설정)
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Material 설정 (점들의 색상)
    const material = new THREE.PointsMaterial({
        color: 0x00ff00,
        size: 0.1  // 점의 크기 설정
      });
  

    // Points 객체 생성
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);


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

export default Point;
