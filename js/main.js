const log = console.log;

(() => {
  let yOffset = 0; // window.pageYOffset 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화(화면에 보여지고 있는)된 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true

  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0, // 디바이스별 스크린 높이 설정 - 별도 함수로 처리
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
      },
      values: {
        messageA_opacity: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity: [0, 1, { start: 0.3, end: 0.4 }],
      },
    },
    {
      // 1
      type: "normal",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
      },
    },
    {
      // 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
    // 새로고침 시 현재 위치(currentScene) 반영
    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }

  function calcValues(values, currentYOffset) {
    // 각 구간별 스크롤 위치에 따른 opacity array를 연산
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight; // 현재 스크롤섹션에서 스크롤된 범위를 비율로 구하기

    if (values.length === 3) {
      // start - end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight; // start 지점
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        rv = ((currentYOffset - partScrollStart) / partScrollHeight) * (values[1] - values[0] + values[0]);
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0] + values[0]);
    }

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight; // 섹션별 현재 위치

    switch (currentScene) {
      case 0:
        // console.log(0);
        let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset);
        objs.messageA.style.opacity = messageA_opacity_in;
        // let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset)
        break;
      case 1:
        // console.log(1);
        break;
      case 2:
        // console.log(2);
        break;
      case 3:
        // console.log(3);
        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return; // scroll bounce 시 마이너스 될 수 있는 가능성 제거
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (enterNewScene) return;
    playAnimation();
  }

  window.addEventListener("load", setLayout); // option: DOMContentLoaded: 돔 구조 로드 시 실행
  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });
})();
