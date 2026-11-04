// ===== 1. 브라우저 크기에 맞춰 포스터 크기 조절 =====
const stage = document.getElementById('stage');

function fitStage() {
  // 가로·세로 중 더 작은 비율에 맞춰 1920x1080 무대를 축소/확대
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  stage.style.setProperty('--scale', scale);
}
fitStage();
window.addEventListener('resize', fitStage);

// ===== 2. 클릭 인터랙션: 클릭한 원이 랜덤 방향으로 ±100px 이동 후 복귀 =====
const circles = document.querySelectorAll('.circle-move');
const RANGE = 100;                 // 이동 범위 (px)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// -RANGE ~ +RANGE 사이의 랜덤 숫자 만들기
function randomOffset() {
  return Math.random() * RANGE * 2 - RANGE;
}

function moveCircle(el) {
  if (prefersReduced) return;      // 움직임 감소 설정이면 이동하지 않음

  // 이전에 예약된 복귀 동작이 있으면 취소 (연속 클릭 대비)
  clearTimeout(el.returnTimer);

  // 위치만 변경 (기본 애니메이션은 안쪽 .circle이 담당하므로 서로 덮어쓰지 않음)
  el.style.transform = `translate(${randomOffset()}px, ${randomOffset()}px)`;

  // 이동이 끝난 뒤 원래 위치로 부드럽게 복귀
  el.returnTimer = setTimeout(() => {
    el.style.transform = 'translate(0, 0)';
  }, 900);
}

circles.forEach((el) => {
  el.addEventListener('click', () => moveCircle(el));

  // 키보드 접근성: Enter / Space 로도 동작
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      moveCircle(el);
    }
  });
});
