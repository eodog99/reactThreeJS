import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function AmbientLight() {
  const selectCanvas3D = useRef();

  let camera, scene, renderer, sphere,Box, pointLight, floor, floorMat, texture;

  // 초기화 함수
  function init() {
    // 카메라 설정
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(-4, 4, 2);

    // 장면 설정
    scene = new THREE.Scene();

    // 구체 도형 생성
    const geometry = new THREE.SphereGeometry(1, 32, 32);  // 반지름 2, 세분화 수준 0
   
    //MeshBasicMaterial 재질
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0x0077ff,  // 파란색
    // });


    //MeshLambertMaterial
    // const material = new THREE.MeshLambertMaterial({
    //   color: 0x0077ff,  // 파란색
    // });
    
    //MeshPhongMaterial 재질
    const material = new THREE.MeshPhongMaterial({
      color: 0x0077ff,  // 파란색
      shininess: 80,  // 반짝임 정도 설정
    });



    // MeshStanderdMaterial 재질
     // const material = new THREE.MeshStandardMaterial(
    //   {color : 0x0077ff, roughness: 0.5,metalness: 0.7}
    // );
    
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow =true;
    scene.add(sphere);

    sphere.position.y = 1
    // Ambient Light : 전체 장면에 균등하게 빛을 비추는 조명.
    const AmbientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(AmbientLight)

    
    //PointLight(점광원)
    //    pointLight = new THREE.PointLight(0xffffff, 100, 17 ); // PointLight 추가
    //    pointLight.position.set(4, 4, 2); // 빛의 위치 설정
    //    pointLight.castShadow = true;
    //    pointLight.shadow.mapSize.width = 2048;  // 그림자 해상도 증가 (기본값 512)
    //    pointLight.shadow.mapSize.height = 2048; // 그림자 해상도 증가 (기본값 512)
    //    scene.add(pointLight);


    // DirectionalLight(방향광) 그림자 생성가능
    //  const DirectionalLight = new THREE.DirectionalLight(0xffffff, 4);
    //  DirectionalLight.position.set(2, 2, 5);  // 위치 설정
    //  DirectionalLight.castShadow = true;  // 그림자 생성
    //  scene.add(DirectionalLight)

    // SpotLight : 특정방향으로 좁은 범위의 빛을 비추는 광원
    const spotLight = new THREE.SpotLight(0xffffff, 100, 5);
    spotLight.position.set(1, 2, 3);  // 위치 설정
    spotLight.castShadow = true;  // 그림자 생성
    scene.add(spotLight);
    spotLight.target = sphere;


    //HemisphereLight
    // const rectAreaLight = new THREE.RectAreaLight(0xffffff, 5, 4, 2);  // 색상, 강도, 너비, 높이
    // rectAreaLight.position.set(0, 2.5, 0); // 위치 설정
    // rectAreaLight.rotation.set(-Math.PI / 2, 2, 2); // 조명의 방향 설정 (빛이 아래로 비추도록)
    // rectAreaLight.castShadow = false;  // 그림자 설정
    // scene.add(rectAreaLight);


        // 바닥 생성 및 텍스처 적용
        const textureLoader = new THREE.TextureLoader();
        const floorTexture = textureLoader.load('/textures/hardwood2_diffuse.jpg');  // 텍스처 경로에 맞게 수정

        const floorMaterial = new THREE.MeshStandardMaterial({
            map: floorTexture,  // 텍스처 적용
            roughness: 0.6,
            metalness: 0.2,
        });

        const floorGeometry = new THREE.PlaneGeometry(30, 30, 30);  // 바닥 크기 설정
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;  // 바닥이 수평이 되도록 회전
        floor.position.y = 0
        floor.receiveShadow = true;
        scene.add(floor);



    // 렌더러 설정
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // 그림자 설정
    //appendChild() : DOM 요소에 자식요소를 추가하는 메서드.
    selectCanvas3D.current.appendChild(renderer.domElement);

    // OrbitControls 추가
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true; // 부드러운 조정
    orbitControls.dampingFactor = 0.25;
    orbitControls.screenSpacePanning = false;
    
    // 렌더링 함수
    function render() {
        renderer.render(scene, camera);
    }
    
    // 애니메이션 루프
    function animate() {
      requestAnimationFrame(animate);
      orbitControls.update(); // OrbitControls 업데이트




      render();
    }


        animate(); // 애니메이션 시작
}

  

  // useEffect 훅: 컴포넌트가 마운트될 때 init을 호출하여 초기화
  useEffect(() => {
    console.log(texture)
    init();
  }, []);

  return <div ref={selectCanvas3D}></div>;
}

export default AmbientLight;
