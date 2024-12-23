import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"

// App 클래스라는 객체지향적인 구조로 작성되어있다.
// Three.js의 3D 애플리케이션을 만들기 위한 다양한 설정과 기능들이 이 클래스 안에 포함되어 있다.
// 이 클래스는 애플리 케이션의 주요 로직을 처리하며, 3D 씬을 설정하고, 카메라 모데레 조명등을 설정한 뒤 애니메이션을 실행하는 역할을 한다.
class App {

    //생성자 constructor()
    // 렌더러 설정: WebGLRender를 생성하고 DOM에 추가함
    // 씬 서렂ㅇ
    // 카메라 설정
    // 조명 설정 
    //모델 설정
    // 컨트롤설정, 리사이즈 처리
    constructor() {
        // webgl-container에 WebGL렌더러를 추가하여 3D씬을 표시한다.
        // 카메라는 원근법 카메라로 설정되며, 씬을 3D로 렌더링 한다.

        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);

        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }
    // orbitControls.를 사용해서 마우스로 씬을 회전하고 이동할 수 있도록 설정
    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupModel() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const material = new THREE.MeshPhongMaterial({color: 0x44a88});

        const cube = new THREE.Mesh(geometry, material);
        this._scene.add(cube);
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            100
        );

        camera.position.z = 2;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    update(time) {
        time *= 0.001; // second unit
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);   
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        
        this._renderer.setSize(width, height);
    }
}

window.onload = function () {
    new App();
}