import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

function AniTime() {
  useEffect(() => {
    gsap.defaults({ ease: "power1", duration: 3 });

    // 타임라인 생성
    const tl = gsap.timeline();

    // 각 섹션에 대한 애니메이션 추가
    tl
      .from(".section03", { yPercent: -100 })
      .from(".section04", { yPercent: 100 })
      .from(".section05", { yPercent: -100 });

    // ScrollTrigger 설정
    ScrollTrigger.create({
      animation: tl,
      trigger: "#container",  // 애니메이션을 시작할 트리거
      start: "top top",        // #container의 상단이 뷰포트 상단에 맞춰질 때 애니메이션 시작
      end: "bottom+=1000",     // #container의 하단이 뷰포트 하단에서 1000px 내려갈 때 애니메이션 끝
      scrub: true,                // 스크롤에 맞춰 애니메이션이 부드럽게 진행됨
      pin: true,               // #container를 고정하여 스크롤 시 고정되도록
      markers: true,           // 마커를 표시하여 애니메이션이 시작/끝하는 위치를 확인
      anticipatePin: 1
    });

  }, []);

  return (
    <div className="App">
      <div className="section01"></div>
      <div id="container">
        <section className="section02"></section>
        <section className="section03"></section>
        <section className="section04"></section>
        <section className="section05"></section>
      </div>
    </div>
  );
}

export default AniTime;
