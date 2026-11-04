// ===== 1. 브라우저 크기에 맞춰 포스터 크기 조절 =====
const stage = document.getElementById('stage');

function getScale() {
  return Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
}

function fitStage() {
  // 가로·세로 중 더 작은 비율에 맞춰 1920x1080 무대를 축소/확대
  stage.style.setProperty('--scale', getScale());
}
fitStage();
window.addEventListener('resize', fitStage);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== 2. 배경에 떠다니는 작은 점 만들기 =====
const field = document.getElementById('field');

// min ~ max 사이의 랜덤 숫자
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

for (let i = 0; i < 12; i++) {
  const dot = document.createElement('i');
  dot.style.left = rand(0, 1720) + 'px';
  dot.style.top = rand(0, 480) + 'px';
  dot.style.setProperty('--dx', rand(-40, 40) + 'px');   // 천천히 옆으로 (Drift)
  dot.style.setProperty('--dy', rand(-70, -20) + 'px');  // 위로 떠오름 (Float)
  dot.style.setProperty('--dur', rand(8, 15) + 's');
  dot.style.setProperty('--delay', rand(-10, 0) + 's');
  field.appendChild(dot);
}

// ===== 3. 클릭 인터랙션: 클릭한 원이 랜덤 방향으로 ±100px 이동 후 복귀 =====
const circleMoves = document.querySelectorAll('.circle-move');
const RANGE = 100;                  // 이동 범위 (px)

// -RANGE ~ +RANGE 사이의 랜덤 숫자
function randomOffset() {
  return rand(-RANGE, RANGE);
}

// 클릭한 순간의 원 위치에 잔상 링 남기기
function leaveGhost(circleMove) {
  const circle = circleMove.querySelector('.circle');
  const rect = circle.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  const scale = getScale();

  // 화면 좌표를 무대(1920x1080) 좌표로 변환
  const centerX = (rect.left + rect.width / 2 - stageRect.left) / scale;
  const centerY = (rect.top + rect.height / 2 - stageRect.top) / scale;

  const ghost = document.createElement('div');
  ghost.className = 'ghost';
  ghost.style.left = centerX - 75 + 'px';
  ghost.style.top = centerY - 75 + 'px';
  stage.appendChild(ghost);
  setTimeout(() => ghost.remove(), 1700);   // 애니메이션이 끝나면 삭제
}

function moveCircle(el) {
  if (prefersReduced) return;       // 움직임 감소 설정이면 이동하지 않음

  // 이전에 예약된 복귀 동작이 있으면 취소 (연속 클릭 대비)
  clearTimeout(el.returnTimer);

  leaveGhost(el);

  // 위치만 변경 (기본 애니메이션은 안쪽 .circle이 담당하므로 서로 덮어쓰지 않음)
  el.style.transform = `translate(${randomOffset()}px, ${randomOffset()}px)`;

  // 이동이 끝난 뒤 원래 위치로 부드럽게 복귀
  el.returnTimer = setTimeout(() => {
    el.style.transform = 'translate(0, 0)';
  }, 900);
}

circleMoves.forEach((el) => {
  el.addEventListener('click', () => moveCircle(el));

  // 키보드 접근성: Enter / Space 로도 동작
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      moveCircle(el);
    }
  });
});
