import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

function Ani() {
  useEffect(() => {
    gsap.utils.toArray("section").forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",  // 섹션이 화면 상단에 닿을 때
        end: "bottom top",  // 섹션이 화면 상단을 벗어날 때
        pin: true,  // 스크롤 시 해당 섹션을 고정시킴
        pinSpacing: false,  // 고정된 섹션의 공간을 유지
      });
    });

    // snap 설정 - 스크롤을 섹션마다 맞추기
    ScrollTrigger.create({
      snap: {
        snapTo:  1 / 4,  // 각 섹션에 맞춰 스크롤
        duration: 0.5,  // 스크롤이 끝날 때까지의 시간
        delay: 0.1,  // 애니메이션 지연 시간
      }
    });
  }, []);

  return (
    <div className="App">
      <section className="section01">
        <h1>section01</h1>
      </section>
      <section className="section02">
        <h1>section02</h1>
      </section>
      <section className="section03">
        <h1>section03</h1>
      </section>
      <section className="section04">
        <h1>section04</h1>
      </section>
      <section className="section05">
        <h1>section05</h1>
      </section>
    </div>
  );
}

export default Ani;
