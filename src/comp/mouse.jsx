import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 큐브 컴포넌트
function Cube() {
  const cubeRef = useRef();
  const [color, setColor] = useState(0x0077ff);

  // 애니메이션: 큐브 회전
  // 매 프레임마다 호출되어 애니메이션을 적용할 수 있다.(이 예제에서는 큐브가 계속)
  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    }
  });

  // 마우스 클릭 처리
  const handleClick = (event) => {
    const newColor = Math.random() * 0xffffff;  // 랜덤 색상
    setColor(newColor);  // 색상 변경
  };

  return (
    <mesh ref={cubeRef} onClick={handleClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// 씬 컴포넌트
function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7.5]} intensity={1} />
      <Cube />
    </Canvas>
  );
}

export default Scene;


