const noBtn = document.getElementById("no");
const yesBtn = document.getElementById("yes");
const msg = document.getElementById("msg");
const card = document.getElementById("card");
const heartsWrap = document.querySelector(".hearts");

// ---------- 1) "No" Button weicht aus ----------
let dodges = 0;

function moveNoButton() {
  dodges++;

  const cardRect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  
  noBtn.style.position = "absolute";

  const padding = 18;
  const maxX = cardRect.width - btnRect.width - padding;
  const maxY = cardRect.height - btnRect.height - 130;

  const x = Math.random() * maxX + padding;
  const y = Math.random() * maxY + 90;

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  const lines = [
    `"No" ist schüchtern 😈`,
    `Allyyy komm schon 😼`,
    `Nice try 😅`,
    `Du kriegst mich nicht 🏃‍♂️💨`,
    `Drück einfach "Yes" 😇`
  ];
  msg.textContent = lines[Math.min(dodges - 1, lines.length - 1)];
}

noBtn.addEventListener("mouseover", moveNoButton);
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

// ---------- 2) Herz-Partikel im Hintergrund ----------
const heartEmojis = ["💗","💖","💘","💕","💞","❤️"];
function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

  const left = Math.random() * 100;
  const dur = 4 + Math.random() * 4;         // 4–8s
  const size = 14 + Math.random() * 18;      // 14–32px

  heart.style.left = `${left}vw`;
  heart.style.bottom = `-30px`;
  heart.style.fontSize = `${size}px`;
  heart.style.animationDuration = `${dur}s`;

  heartsWrap.appendChild(heart);
  setTimeout(() => heart.remove(), dur * 1000);
}
setInterval(spawnHeart, 350);

// ---------- 3) Konfetti (Canvas) ----------
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resizeCanvas(){
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
resizeCanvas();
window.addEventListener("resize", () => {
  // einfacher reset
  ctx.setTransform(1,0,0,1,0,0);
  resizeCanvas();
});

let confettiPieces = [];
let confettiOn = false;

function makeConfetti(count = 140){
  confettiPieces = Array.from({length: count}, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.3,
    r: 3 + Math.random() * 5,
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 5,
    rot: Math.random() * Math.PI,
    vr: -0.2 + Math.random() * 0.4,
    // keine festen Farben nötig – nutzen Emoji-Konfetti in Herzform über Text:
    shape: Math.random() < 0.4 ? "heart" : "dot"
  }));
}

function drawHeart(x, y, s){
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-1.2, -1.2, -3, -0.2, 0, 2.2);
  ctx.bezierCurveTo(3, -0.2, 1.2, -1.2, 0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function confettiLoop(){
  if(!confettiOn) return;

  ctx.clearRect(0,0, window.innerWidth, window.innerHeight);

  confettiPieces.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    // leichte "Luft"-Schwankung
    p.vx += (-0.03 + Math.random()*0.06);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    // Farbe pro Piece zufällig bei jedem Frame minimal verändert? -> hier simpel:
    ctx.fillStyle = `hsla(${Math.floor(Math.random()*360)}, 80%, 60%, 0.9)`;

    if(p.shape === "heart"){
      drawHeart(0, 0, p.r/6);
    } else {
      ctx.beginPath();
      ctx.arc(0,0,p.r,0,Math.PI*2);
      ctx.fill();
    }

    ctx.restore();
  });

  // rausfiltern
  confettiPieces = confettiPieces.filter(p => p.y < window.innerHeight + 40);

  if(confettiPieces.length > 0){
    requestAnimationFrame(confettiLoop);
  } else {
    confettiOn = false;
    ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
  }
}

function fireConfetti(){
  makeConfetti(180);
  confettiOn = true;
  confettiLoop();
}

// ---------- 4) YES Click -> Screen + Konfetti ----------
yesBtn.addEventListener("click", () => {
  fireConfetti();
  card.innerHTML = `
    <div class="top">
      <img class="photo" src="ally.jpg" alt="Ally" />
      <div class="badge">💍</div>
    </div>
    <h1>YAAAAY, Ally! 💘</h1>
    <p class="subtitle">Beste Entscheidung des Tages 😌</p>
    <p class="subtitle">Jetzt bist du offiziell mein Valentine 😄</p>
  `;
});
