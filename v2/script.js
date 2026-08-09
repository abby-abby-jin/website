// ---------------------------------------------------------
// 선진이 포폴 — 하나의 성
// 프로토타입 빌드: 콘텐츠/비주얼은 임시 자리표시자입니다.
// ---------------------------------------------------------

const projects = {
  binggrae: {
    id: "binggrae",
    type: "video",
    eyebrow: "Video Campaign",
    title: "빙그레 — 브랜디드 캠페인",
    issue: "브랜드 네임 자산화 미흡",
    solution: "빙그레우스를 활용하여 '웃음'이라는 가치를 전하려는 사람들의 도전을 숭고하게 드높이기",
    heroVideo: "../videos/binggrae-ref-500days.mp4",
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
  mermaid: {
    id: "mermaid",
    type: "sns",
    eyebrow: "SNS Campaign",
    title: "氷어공주 — SNS 캠페인",
    posts: [
      { caption: "2021 氷어공주" },
      { caption: "氷어공주는 마녀에게 목소리를 주고 다리를 얻어 드디어 육지로 나왔어요.\n“진정한 사랑을 하지 못하면 넌 물거품이 될 게다”" },
      { caption: "하지만 왕자는 이웃나라 공주랑 러브러브 하고 있었죠.\n“내 생명의 은인~ 당신이 나를 바다에서 구했소!”\n“제.. 제가요? 아 그렇다고 보답ㅎㅎ”" },
      { caption: "氷어공주는 답답한 맘에 소리를 지르고 싶었지만\n목소리는 나오지 않았어요ㅠㅠ" },
      { caption: "그래서 그냥 다른 사랑을 찾았답니다!\n“상처만 주는 사랑은 쿨하게 잊어버려요!”" },
      { caption: "CASTOYS × TOY KINGDOM\n물속에서 변신하는 인어공주 미미" },
    ],
  },
};

// ---------------------------------------------------------
// 상태
// ---------------------------------------------------------
let overlayOpen = false;
let currentProject = null;
let snsActive = 0;

const $ = (sel) => document.querySelector(sel);
const chamberEls = {
  video: $("#chamber-video"),
  sns: $("#chamber-sns"),
};

// ---------------------------------------------------------
// 성 스크롤 페이지 — 스크롤로 층이 시야에 들어오면 이름표 페이드인
// ---------------------------------------------------------
const hotspots = document.querySelectorAll(".floor-hotspot");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("revealed");
    });
  },
  { threshold: 0.4 }
);
hotspots.forEach((el) => revealObserver.observe(el));

hotspots.forEach((el) => {
  el.addEventListener("click", () => openProject(el.dataset.floor));
});

// ---------------------------------------------------------
// 오버레이 열기/닫기
// ---------------------------------------------------------
function openProject(id) {
  const project = projects[id];
  if (!project) return;
  currentProject = project;
  overlayOpen = true;

  Object.values(chamberEls).forEach((el) => el.classList.remove("active"));
  if (project.type === "video") {
    chamberEls.video.classList.add("active");
    renderVideoChamber(project);
  } else {
    chamberEls.sns.classList.add("active");
    renderSnsChamber(project);
  }

  $("#chamber-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProject() {
  overlayOpen = false;
  $("#chamber-overlay").classList.remove("open");
  document.body.style.overflow = "";
  const heroVideo = $("#hero-video");
  heroVideo.pause();
  heroVideo.removeAttribute("src");
}

// ---------------------------------------------------------
// VIDEO CHAMBER
// ---------------------------------------------------------
function renderVideoChamber(project) {
  $("#video-eyebrow").textContent = project.eyebrow;
  $("#video-title").textContent = project.title;
  $("#wn-issue").textContent = project.issue;
  $("#wn-solution").textContent = project.solution;

  const heroVideo = $("#hero-video");
  if (project.heroVideo) {
    heroVideo.muted = true;
    heroVideo.onpause = () => {
      // 자동재생 정책 등으로 예기치 않게 멈추면 다시 시도
      if (!heroVideo.ended && overlayOpen) heroVideo.play().catch(() => {});
    };
    heroVideo.src = project.heroVideo;
    heroVideo.play().catch(() => {});
  }
  $("#hero-mute").textContent = "🔇";

  $("#wn-script").innerHTML = project.script
    .map(
      (block) =>
        `<span class="speaker">${block.speaker}</span>` +
        block.lines.map((l) => `<p class="line">${l}</p>`).join("")
    )
    .join("");

  $("#chamber-video").scrollTo({ top: 0, behavior: "instant" });
}

function scrollToNotes() {
  $("#chamber-video").scrollTop = $("#working-notes").offsetTop;
}

// ---------------------------------------------------------
// SNS CHAMBER
// ---------------------------------------------------------
function renderSnsChamber(project) {
  $("#sns-eyebrow").textContent = project.eyebrow;
  $("#sns-title").textContent = project.title;
  snsActive = 0;

  const carousel = $("#sns-carousel");
  carousel.innerHTML = project.posts
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
        openSnsDetail(project, i);
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

function openSnsDetail(project, i) {
  const post = project.posts[i];
  $("#sns-detail-image").style.backgroundImage = placeholderGradient(i);
  $("#sns-detail-caption").textContent = post.caption;
  openPanel("#sns-detail");
}

function openPanel(sel) {
  $(sel).classList.add("open");
}
function closePanel(sel) {
  $(sel).classList.remove("open");
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
  if (!overlayOpen) return;

  const snsOpen = $("#sns-detail").classList.contains("open");
  if (snsOpen) {
    if (e.key === "Escape" || e.key === " ") closePanel("#sns-detail");
    return;
  }

  if (e.key === "Escape") {
    closeProject();
    return;
  }

  if (currentProject.type === "video" && (e.key === " " || e.key === "Enter")) {
    e.preventDefault();
    scrollToNotes();
    return;
  }

  if (currentProject.type === "sns") {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setSnsActive(Math.min(snsActive + 1, currentProject.posts.length - 1));
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSnsActive(Math.max(snsActive - 1, 0));
    }
    if (e.key === "Enter") {
      openSnsDetail(currentProject, snsActive);
    }
  }
});

// SNS 챔버: 마우스/트랙패드 가로 스크롤로도 게시물 탐색
let wheelCooldown = false;
document.addEventListener(
  "wheel",
  (e) => {
    if (!overlayOpen || !currentProject || currentProject.type !== "sns") return;
    if ($("#sns-detail").classList.contains("open")) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 8) return;
    e.preventDefault();
    if (wheelCooldown) return;
    wheelCooldown = true;
    setTimeout(() => { wheelCooldown = false; }, 350);
    if (delta > 0) {
      setSnsActive(Math.min(snsActive + 1, currentProject.posts.length - 1));
    } else {
      setSnsActive(Math.max(snsActive - 1, 0));
    }
  },
  { passive: false }
);

$("#wn-cta").addEventListener("click", scrollToNotes);
$("#hero-mute").addEventListener("click", () => {
  const v = $("#hero-video");
  v.muted = !v.muted;
  $("#hero-mute").textContent = v.muted ? "🔇" : "🔊";
});
$("#sns-close").addEventListener("click", () => closePanel("#sns-detail"));
$("#overlay-close").addEventListener("click", closeProject);
$("#ambience-btn").addEventListener("click", toggleAmbience);
