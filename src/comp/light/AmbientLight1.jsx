import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function AmbientLight1() {
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
    const BoxGeometry = new THREE.BoxGeometry(3 , 3 , 3 );
    const BoxMaterial = new THREE.MeshStandardMaterial({ color: 0xffffbb}); 
    sphere = new THREE.Mesh(BoxGeometry, BoxMaterial);

    sphere.castShadow =true;
    scene.add(sphere);


    // Ambient Light
    const AmbientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(AmbientLight)

    
    //PointLight(점광원)
      //  pointLight = new THREE.PointLight(0xffffff, 100, 17 ); // PointLight 추가
      //  pointLight.position.set(4, 4, 2); // 빛의 위치 설정
      //  pointLight.castShadow = true;
      //  pointLight.shadow.mapSize.width = 2048;  // 그림자 해상도 증가 (기본값 512)
      //  pointLight.shadow.mapSize.height = 2048; // 그림자 해상도 증가 (기본값 512)
      //  scene.add(pointLight);


    // DirectionalLight(방향광) 그림자 생성가능
    //  const DirectionalLight = new THREE.DirectionalLight(0xffffff, 4);
    //  DirectionalLight.position.set(2, 2, 5);  // 위치 설정
    //  DirectionalLight.castShadow = true;  // 그림자 생성
    //  scene.add(DirectionalLight)

    // SpotLight : 특정방향으로 좁은 범위의 빛을 비추는 광원
    // const spotLight = new THREE.SpotLight(0xffffff, 100, 10);
    // spotLight.position.set(1, 2, 3);  // 위치 설정
    // spotLight.castShadow = true;  // 그림자 생성
    // scene.add(spotLight);
    // spotLight.target = sphere;


    //HemisphereLight
    const hemisphereLight = new THREE.HemisphereLight(0x00ff00, 0x0000ff, 1);  // 하늘은 초록색, 땅은 파란색
    scene.add(hemisphereLight);


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
        floor.position.y = -1
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

export default AmbientLight1;
