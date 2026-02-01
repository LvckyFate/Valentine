const noBtn = document.getElementById("no");
const msg = document.getElementById("msg");

noBtn.addEventListener("mouseover", () => {
  const x = Math.random() * 200 - 100;
  const y = Math.random() * 200 - 100;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
  msg.innerText = `"No" seems a bit shy 😈`;
});

document.getElementById("yes").onclick = () => {
  document.body.innerHTML = "<h1>YAY 💘🥰</h1>";
};
