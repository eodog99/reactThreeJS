import React, { useEffect } from "react";
import gsap from "gsap";

function AniFrom() {
//GSAP를 최대한 활용하려면 트윈가 타임라인이 무엇인지 이해하는 것이 중요하다.

//트윈이란 : 트윈은 모든 애니메이션 작업을 담당한다. 고성능 속성 세터라고 생각하면 댐
//대상, 지속시간, 애니메이션화 하려는 속성을 입력한다음 다음 트윈의 재생헤드가 새로운 위치로 이동하면 해당 지점에서 속성값이 무엇이어야 하는지 파악하여 그에 따라 적용한다.

    //최소 한번 실행을 위해 useEffect 사용
    useEffect( ()=> {

        //green 클래스를 가진 요소에 대한 애니메이션을 실행한다 
        // gsap.to() : 대상 요소의 현재상태에서 목표상태로 애니메이션을 진행한다.
        //대상 요소가 어떤 상태인지 상관없이 목표 상태로 가는 애니메이션을 생성한다.
        // 즉 요소가 rotation:0 이거나 rotation: 180 이더라도 360도 회전할 것이다.
        gsap.to(".green", {rotation: 360, x: 100, duration: 1});

        //purplee 클래스를 가진 요소에 대한 애니메이션을 실행한다.
        // gsap.from() : 대상 요소가 애니메이션을 시작하기 전에 주어진 시작 상태로부터 애니메이션을 진행한다.
        // 시작 상태를 정의하고, 그 상태에서 현재 상태로 애니메이션이 진행되도록 만든다.
        gsap.from(".purple", {rotation: -360, x: 100, duration: 1});
        
        // blue 클래스를 가진 요소에 대한 애니메이션을 실행한다.
        // 시작상태를 x: -100에서 시작하여 rotation : 360 과 x: 100 로 환한다.
        gsap.fromTo(".blue", {x: -100},{rotation: 360, x: 100, duration: 1});
    },[]);

    
    //요약
//gsap.to(): 요소의 현재 상태에서 목표 상태로 애니메이션을 진행. (목표 상태만 설정)
//gsap.from(): 애니메이션의 시작 상태에서 현재 상태로 진행. (시작 상태만 설정)
//gsap.fromTo(): 시작 상태에서 목표 상태로 애니메이션을 진행. (시작 상태와 목표 상태 모두 설정)

return (
    <div className="App">
<div className="box gradient-green green"></div>
<div className="box gradient-purple purple"></div>
<div className="box gradient-blue blue"></div>
    </div>

);

}

export default AniFrom