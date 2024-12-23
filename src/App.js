import Light from "./comp/lights/ambientLight"
import Light2 from "./comp/lights/directionalLight"
import Light3 from "./comp/lights/hemiphereLight"
import Light4 from "./comp/lights/light"
import Light5 from "./comp/lights/pointLight"
import Light6 from "./comp/lights/rectAreaLight"
import Light7 from "./comp/lights/spotLight"
import Ani from "./comp/gsap/ex01"
import './css/anistyle.css';
import AniFrom from "./comp/gsap/ex02"
import AniTime from "./comp/gsap/ex03"
import Map from "./comp/map"
import Scene from "./comp/mouse" 
import Player from "./comp/raycaster"
import Ray from "./Application/raycaster"
import FBXModelLoader from "./Application/FBXLoader"
import LightProbeExample from './Application/LightProbe'
import AmbientLight from "./comp/light/AmbientLight"
import AmbientLight1 from "./comp/light/AmbientLight1"
import Line from "./Application/Line"
import ModelLoader from "./comp/gltfLoader"
import Point from "./Application/Point"


function App() {
  return (
    <div className="App">
     <ModelLoader></ModelLoader>
    </div>
  );
}

export default App;

