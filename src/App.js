import Light from "./comp/lights/ambientLight"
import Light2 from "./comp/lights/directionalLight"
import Light3 from "./comp/lights/hemiphereLight"
import Light4 from "./comp/lights/light"
import Light5 from "./comp/lights/pointLight"
import Light6 from "./comp/lights/rectAreaLight"
import Light7 from "./comp/lights/spotLight"
import Ani from "./comp/gsap/ex01"
import './css/anistyle.css';

function App() {
  return (
    <div className="App">
     <Ani></Ani>
    </div>
  );
}

export default App;

