import React, { useEffect } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import gsap from 'gsap';


function Map() {


  // 구글맵을 초기화하고 3D 모델을 로드하는 함수
  function createMap() {

  //apiOption : apiKey와 version 정보를 설정하여 구글맵 API를 로드한다.
  //apiKey는 반드시 본인의 구글 API키로 설정해야한다.
    const apiOptions = {
      "apiKey": "AIzaSyCAm-xSF7xuCXefu_4T2T3rfqRx9otDRQI",
      "version": "beta"
    };


    // mapOptions : 맵의 설정을 의미한다.
    //여기서는 맵의 기울기 회전 줌과 중심 좌표를 설정한다.
    const mapOptions = {
      "tilt": 45,
      "heading": 0,
      "zoom": 18,
      "center": { lat: 35.224676, lng: 129.084904 },
      "mapId": "88729299cb6cebd8"
    };



    // 구글맵을 초기화하는 부분
    async function initMap() {
      const mapDiv = document.getElementById("map");
      const apiLoader = new Loader(apiOptions);
      await apiLoader.load();
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(mapDiv, mapOptions);

      initWebGLOverlayView(map); // WebGLOverlayView 초기화

      return map;
    }


    // WebGLOverlayView : 구글맵 위에 3D 그래픽을 그릴 수 있도록 해주는 기능이다.
    // 이걸 사용해서 3D 모델을 맵위에 올릴 수 있음.
    function initWebGLOverlayView(map) {
      let scene, renderer, camera, loader;
      let clock, mixer;
      
      clock = new THREE.Clock(); // 애니메이션을 위한 시계 객체
      
      // eslint-disable-next-line no-undef
      const webGLOverlayView = new google.maps.WebGLOverlayView(); // 구글맵의 WebGLOverlayView 객체 생성

      //WebGLOverlayView에 새로운 요소가 추가될 때 실행된다
      //여기서는 THREE.js 씬을 초기화하고, 카메라, 조명, 3D모델을 설정한다.
      webGLOverlayView.onAdd = () => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera();
        const ambientLight = new THREE.AmbientLight(0xffffff, 5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
        directionalLight.position.set(0.5, -1, 0.5);
        scene.add(directionalLight);

        loader = new FBXLoader(); // FBX 모델 로더 설정
        const source = process.env.PUBLIC_URL + '/fbx/kid2.fbx'; // FBX 모델 경로
        loader.load(source, fbx => {  // FBX 모델 로드
          fbx.scale.set(0.2, 0.2, 0.2); // 모델 크기 조정
          fbx.position.set(0, 0, -100); // 모델 위치 설정
          fbx.rotation.x = 90 * Math.PI / 180; // 회전(x축 90도)
          fbx.rotation.y = 5.6; // 회전 (y축)
          scene.add(fbx); // 씬에 모델 추가 

          


          mixer = new THREE.AnimationMixer(fbx); // 애니메이션 믹서 생성
          const clips = fbx.animations; // 모델의 애니메이션 클립 가져오기 
          const clip = THREE.AnimationClip.findByName(clips, 'mixamo.com'); // 특정 애니메이션 찾기
          const action = mixer.clipAction(clip); // 애니메이션 액션 생성

          action.play();  // 애니메이션 시작
        });

        // 추가 모델 로드
        loadFBX(loader, scene, process.env.PUBLIC_URL + '/fbx/bedroom.fbx', 130, 30);
        loadFBX(loader, scene, process.env.PUBLIC_URL + '/fbx/bicycle.fbx', -120, -150);
        loadFBX(loader, scene, process.env.PUBLIC_URL + '/fbx/cab.fbx', 50, 130, 0.003);
      };

      // WebGL 컨텍스트가 복원되었을 때 호출되는 콜백 함수
      webGLOverlayView.onContextRestored = ({ gl }) => {
        renderer = new THREE.WebGLRenderer({
          canvas: gl.canvas,
          context: gl,
          ...gl.getContextAttributes()
        });

        renderer.autoClear = false; // 자동 지우기 비활성화

        loader.manager.onLoad = () => { };
      };

      // 매프레임마다 호출되는 onDraw 함수
      //매번 렌더링할 때마다 호출되며, 이곳에서 씬을 실제로 렌더링한다.
      //카메라의 위치와 맵 좌표계를 맞춰주는 작업도 이곳에서 처리한다.
      webGLOverlayView.onDraw = ({ gl, transformer }) => {
        const latLngAltitudeLiteral = {
          lat: mapOptions.center.lat,
          lng: mapOptions.center.lng,
          altitude: 100
        };

        // 변환기에서 위도, 경도, 고도를 사용하여 카메라 프로젝션 행렬 계산
        const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
        camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

        webGLOverlayView.requestRedraw(); // 맵을 다시 그리도록 요청
        renderer.render(scene, camera); // 씬과 카메라를 사용해 렌더링
        renderer.resetState(); // 렌더러 상태 초기화

        mixer?.update(clock.getDelta()); // 애니메이션 믹서 업데이트
      };

      webGLOverlayView.setMap(map); // 구글맵에 WebGLOverlayView를 설정
    }

    // FBX 모델을 로드하는 함수
    function loadFBX(loader, scene, path, x, y, scale = 0.2) {
      loader.load(path, fbx => {
        fbx.scale.set(0, 0, 0); // 초기 크기 설정
        setTimeout(() => {
          // 모델 크기 애니메이션 (기존 코드 유지)
          gsap.to(fbx.scale, {
            x: scale, 
            y: scale, 
            z: scale,
            duration: 2.5,
            ease: 'elastic.out(1, 0.3)',
          });
        }, 3000);
        fbx.position.set(x, y, -100); // 초기 위치 설정
        fbx.rotation.x = 90 * Math.PI / 180; // 회전 설정 (x축 90도)
        fbx.rotation.y = 1.6; // 회전 (y축)
        scene.add(fbx); // 씬에 모델 추가
    
        // 모델 회전 애니메이션 추가
        gsap.to(fbx.rotation, {
          y: fbx.rotation.y + Math.PI * 2, // 한 바퀴 회전
          duration: 5, // 5초에 걸쳐 한 바퀴 회전
          ease: 'none', // 일정한 속도로 회전
          repeat: 3, // 무한 반복
        });
      });
    }
    

    (async () => {
      await initMap();
    })();
  }

  useEffect(() => {
    createMap();
  }, []);

  return (
    <div className="contacts">
      <div id="map" style={{ width: '100%', height: '100vh' }}></div>
    </div>
  );
}

export default Map;
