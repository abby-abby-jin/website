// ---------------------------------------------------------
// 선진이 포폴 — 하나의 성
// 프로토타입 빌드: 챔버 콘텐츠/비주얼은 임시 자리표시자입니다.
// 실제 에셋/최종 비주얼로 교체 예정 (기획 정리 문서 12번 항목 참고)
// ---------------------------------------------------------

const floors = [
  {
    id: "binggrae",
    type: "video",
    eyebrow: "Video Campaign",
    title: "빙그레 — 브랜디드 캠페인",
    client: "빙그레",
    summary: "브랜드 창립 53주년을 기념한 브랜디드 캠페인입니다. (기여도 20%)",
    issue: "브랜드 네임 자산화 미흡",
    solution: "빙그레우스를 활용하여 '웃음'이라는 가치를 전하려는 사람들의 도전을 숭고하게 드높이기",
    role: "첫 카피와 마지막 카피 및 말장난이 섞인 대사를 작성했습니다. 가사가 완성된 후 작곡가 및 편집팀과 커뮤니케이션하여 제작 일정 등을 조율하며 애니메이션 캠페인의 이해도와 커뮤니케이션 스킬을 쌓을 수 있었던 캠페인입니다.",
    refVideo: "videos/binggrae-ref-500days.mp4",
    results: [
      "업로드 3주 만에 댓글 7K · 좋아요 25K",
      "25년 기준 조회수 10M 돌파",
      "전년 대비 매출액 6.7% / 영업이익 14.33% 증가",
    ],
    script: [
      { speaker: "빙그레우스", lines: [
        "자, 업무보고 끝났소? 그럼 업무보스탑!",
        "아니~ 업무보GO였으니까 업무보STOP~ 하하하하!",
        "업무보GO! 업무보STOP! 하하하하!",
        "(갑자기 끌려가며) 이게 무슨 짓이오! 아바마마!",
      ]},
      { speaker: "왕", lines: ["재판의 주제가 무엇이냐"] },
      { speaker: "투게더리고리경", lines: [
        "피고인 빙그레우스를 재판에 소환한 이유는",
        "회의 시간마다 반복되는 썰렁한 농담!",
      ]},
      { speaker: "빙그레우스", lines: ["너무하시오! 나는 배추하겠소~"] },
      { speaker: "투게더리고리경", lines: ["저 역시 투게더 하겠습니다"] },
      { speaker: "빙그레우스", lines: [
        "웃는 것만으로도 기분이 한결 나아질 때가 있소",
        "우린 그 웃음의 힘을 알기에",
        "세상의 모든 빙그레 메이커를 응원하오",
      ]},
    ],
  },
  {
    id: "mermaid",
    type: "sns",
    eyebrow: "SNS Campaign",
    title: "氷어공주 — SNS 캠페인",
    posts: [
      { caption: "2021 氷어공주", art: "cover" },
      { caption: "氷어공주는 마녀에게 목소리를 주고 다리를 얻어 드디어 육지로 나왔어요.\n“진정한 사랑을 하지 못하면 넌 물거품이 될 게다”", art: "1" },
      { caption: "하지만 왕자는 이웃나라 공주랑 러브러브 하고 있었죠.\n“내 생명의 은인~ 당신이 나를 바다에서 구했소!”\n“제.. 제가요? 아 그렇다고 보답ㅎㅎ”", art: "2" },
      { caption: "氷어공주는 답답한 맘에 소리를 지르고 싶었지만\n목소리는 나오지 않았어요ㅠㅠ", art: "3" },
      { caption: "그래서 그냥 다른 사랑을 찾았답니다!\n“상처만 주는 사랑은 쿨하게 잊어버려요!”", art: "4" },
      { caption: "CASTOYS × TOY KINGDOM\n물속에서 변신하는 인어공주 미미", art: "brand" },
    ],
  },
];

// forced-random 순서 큐
let queue = [];
function refillQueue() {
  const idx = floors.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  // 방금 본 층이 다시 바로 나오지 않도록 살짝 보정
  if (idx.length > 1 && idx[0] === lastFloor) {
    [idx[0], idx[1]] = [idx[1], idx[0]];
  }
  queue = idx;
}
let lastFloor = -1;
function nextFloorIndex() {
  if (queue.length === 0) refillQueue();
  const i = queue.shift();
  lastFloor = i;
  return i;
}

// ---------------------------------------------------------
// 상태
// ---------------------------------------------------------
let view = "lobby"; // lobby | transition | chamber
let currentFloor = null;
let snsActive = 0;
let seenCount = 0;

const $ = (sel) => document.querySelector(sel);
const views = {
  lobby: $("#view-lobby"),
  transition: $("#view-transition"),
  chamber: $("#view-chamber"),
};
const chamberEls = {
  video: $("#chamber-video"),
  sns: $("#chamber-sns"),
};
const floorIndicator = $("#floor-indicator");

function setView(name) {
  Object.values(views).forEach((v) => v.classList.remove("active"));
  views[name].classList.add("active");
  view = name;
}

function playTransition(onDone) {
  setView("transition");
  const slices = $(".slices");
  slices.classList.remove("playing");
  void slices.offsetWidth; // reflow to restart animation
  slices.classList.add("playing");
  setTimeout(onDone, 300);
  setTimeout(() => slices.classList.remove("playing"), 600);
}

function enterFloor(i) {
  currentFloor = floors[i];
  seenCount += 1;
  floorIndicator.textContent = `FLOOR ${String(seenCount).padStart(2, "0")} · ${currentFloor.eyebrow.toUpperCase()}`;

  Object.values(chamberEls).forEach((el) => el.classList.remove("active"));
  if (currentFloor.type === "video") {
    renderVideoChamber(currentFloor);
    chamberEls.video.classList.add("active");
  } else {
    renderSnsChamber(currentFloor);
    chamberEls.sns.classList.add("active");
  }
  setView("chamber");
}

function goToLobby() {
  playTransition(() => {
    floorIndicator.textContent = "";
    setView("lobby");
  });
}

function goToNextFloor() {
  const i = nextFloorIndex();
  playTransition(() => enterFloor(i));
}

// ---------------------------------------------------------
// VIDEO CHAMBER
// ---------------------------------------------------------
function renderVideoChamber(floor) {
  $("#video-eyebrow").textContent = floor.eyebrow;
  $("#video-title").textContent = floor.title;
  $("#wn-client").textContent = floor.client;
  $("#wn-summary").textContent = floor.summary;
  $("#wn-issue").textContent = floor.issue;
  $("#wn-solution").textContent = floor.solution;
  $("#wn-role").textContent = floor.role;

  $("#wn-results").innerHTML = floor.results
    .map((r) => `<li>${r}</li>`)
    .join("");

  const refWrap = $("#wn-ref-video-wrap");
  const refVideo = $("#wn-ref-video");
  if (floor.refVideo) {
    refVideo.src = floor.refVideo;
    refWrap.hidden = false;
  } else {
    refVideo.removeAttribute("src");
    refWrap.hidden = true;
  }

  $("#wn-script").innerHTML = floor.script
    .map(
      (block) =>
        `<span class="speaker">${block.speaker}</span>` +
        block.lines.map((l) => `<p class="line">${l}</p>`).join("")
    )
    .join("");

  closePanel("#working-notes");
}

function openPanel(sel) {
  $(sel).classList.add("open");
}
function closePanel(sel) {
  $(sel).classList.remove("open");
}

// ---------------------------------------------------------
// SNS CHAMBER
// ---------------------------------------------------------
function renderSnsChamber(floor) {
  $("#sns-eyebrow").textContent = floor.eyebrow;
  $("#sns-title").textContent = floor.title;
  snsActive = 0;

  const carousel = $("#sns-carousel");
  carousel.innerHTML = floor.posts
    .map(
      (p, i) =>
        `<div class="thumb ${i === 0 ? "active" : ""}" data-i="${i}" style="background-image:${placeholderGradient(i)}">
           <span>${p.caption.split("\n")[0]}</span>
         </div>`
    )
    .join("");

  carousel.querySelectorAll(".thumb").forEach((el) => {
    el.addEventListener("click", () => {
      const i = Number(el.dataset.i);
      if (i === snsActive) {
        openSnsDetail(floor, i);
      } else {
        setSnsActive(i);
      }
    });
  });

  closePanel("#sns-detail");
}

function placeholderGradient(i) {
  const palettes = [
    "linear-gradient(160deg,#3a2f55,#1b1622)",
    "linear-gradient(160deg,#204a5c,#12232b)",
    "linear-gradient(160deg,#5a3a3a,#221515)",
    "linear-gradient(160deg,#2f4a3a,#152219)",
    "linear-gradient(160deg,#54492f,#221d13)",
    "linear-gradient(160deg,#402f54,#1a1522)",
  ];
  return palettes[i % palettes.length];
}

function setSnsActive(i) {
  snsActive = i;
  $("#sns-carousel")
    .querySelectorAll(".thumb")
    .forEach((el) => el.classList.toggle("active", Number(el.dataset.i) === i));
}

function openSnsDetail(floor, i) {
  const post = floor.posts[i];
  $("#sns-detail-image").style.backgroundImage = placeholderGradient(i);
  $("#sns-detail-caption").textContent = post.caption;
  openPanel("#sns-detail");
}

// ---------------------------------------------------------
// AMBIENCE (Web Audio 합성음 — 외부 파일 없이 재생)
// ---------------------------------------------------------
let audioCtx, ambienceNodes, ambienceOn = false;
function toggleAmbience() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (!ambienceOn) {
    audioCtx.resume();
    const master = audioCtx.createGain();
    master.gain.value = 0;
    master.connect(audioCtx.destination);
    master.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 1.2);

    const notes = [110, 164.81, 220];
    const oscs = notes.map((freq) => {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = audioCtx.createGain();
      g.gain.value = 1 / notes.length;
      osc.connect(g).connect(master);
      osc.start();
      return osc;
    });
    ambienceNodes = { master, oscs };
    ambienceOn = true;
  } else {
    const { master, oscs } = ambienceNodes;
    master.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
    setTimeout(() => oscs.forEach((o) => o.stop()), 900);
    ambienceOn = false;
  }
  $("#ambience-btn").classList.toggle("on", ambienceOn);
  $("#ambience-btn").textContent = ambienceOn ? "🔊" : "🔈";
}

// ---------------------------------------------------------
// 이벤트
// ---------------------------------------------------------
document.addEventListener("keydown", (e) => {
  if (view === "transition") return;

  // 패널이 열려있으면 Escape로만 닫기
  const wnOpen = $("#working-notes").classList.contains("open");
  const snsOpen = $("#sns-detail").classList.contains("open");
  if (wnOpen || snsOpen) {
    if (e.key === "Escape" || e.key === " ") {
      closePanel("#working-notes");
      closePanel("#sns-detail");
    }
    return;
  }

  if (view === "lobby") {
    if (["ArrowUp", "ArrowDown", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      goToNextFloor();
    }
    return;
  }

  if (view === "chamber") {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      goToNextFloor();
      return;
    }
    if (currentFloor.type === "video" && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      openPanel("#working-notes");
      return;
    }
    if (currentFloor.type === "sns") {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setSnsActive(Math.min(snsActive + 1, currentFloor.posts.length - 1));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSnsActive(Math.max(snsActive - 1, 0));
      }
      if (e.key === "Enter") {
        openSnsDetail(currentFloor, snsActive);
      }
    }
  }
});

$("#video-trigger").addEventListener("click", () => openPanel("#working-notes"));
$("#wn-close").addEventListener("click", () => closePanel("#working-notes"));
$("#sns-close").addEventListener("click", () => closePanel("#sns-detail"));
$("#home-btn").addEventListener("click", () => {
  if (view !== "lobby") goToLobby();
});
$("#ambience-btn").addEventListener("click", toggleAmbience);

// 초기 진입
setView("lobby");
