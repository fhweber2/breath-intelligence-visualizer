const orb = document.getElementById("breath-orb");
const stateText = document.getElementById("state-text");
const cycleText = document.getElementById("cycle-text");
const rhythmIndicator = document.getElementById("rhythm-indicator");
const modeButtons = document.querySelectorAll(".mode-btn");
const field = document.getElementById("field");
const groupOrbs = document.getElementById("group-orbs");
const eclipseRing = document.getElementById("eclipse-ring");
const earthLines = document.getElementById("earth-lines");
const modePillText = document.getElementById("mode-pill-text");

// synthetic breath timing: 4s inhale, 6s exhale
const inhaleMs = 4000;
const exhaleMs = 6000;
const totalMs = inhaleMs + exhaleMs;

let cycleCount = 0;
let currentMode = "coherence";

const modeDescriptions = {
  coherence: "Coherence Mode · field-centric visualization",
  earth: "Earth Mode · vertical field lines & resonance hints",
  eclipse: "Eclipse Mode · corona alignment during the cycle",
  group: "Group Field Mode · distributed nodes pulsing together"
};

function setMode(mode) {
  currentMode = mode;

  modeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  groupOrbs.classList.toggle("active", mode === "group");
  eclipseRing.classList.toggle("active", mode === "eclipse");
  earthLines.classList.toggle("active", mode === "earth");

  if (mode === "coherence") {
    field.style.background =
      "radial-gradient(circle at center, #071628, #030510 70%, #000000)";
  } else if (mode === "earth") {
    field.style.background =
      "radial-gradient(circle at bottom, #04101c, #02040c 65%, #000000)";
  } else if (mode === "eclipse") {
    field.style.background =
      "radial-gradient(circle at center, #020308, #02020a 60%, #000000)";
  } else if (mode === "group") {
    field.style.background =
      "radial-gradient(circle at center, #081626, #03030f 70%, #000000)";
  }

  modePillText.textContent = modeDescriptions[mode] || "";
}

function setState(state) {
  orb.classList.remove("inhale", "exhale", "coherent");

  if (state === "inhale") {
    orb.classList.add("inhale");
    stateText.textContent = "Inhale";
  } else if (state === "exhale") {
    orb.classList.add("exhale");
    stateText.textContent = "Exhale";
  } else if (state === "coherent") {
    orb.classList.add("inhale", "coherent");
    stateText.textContent = "Coherent";
  }
}

function animateRhythm(progress) {
  const clamped = Math.max(0, Math.min(1, progress));
  const translatePercent = clamped * 100;
  rhythmIndicator.style.transform = `translateX(${translatePercent}%)`;
}

function startBreathing() {
  let cycleStart = performance.now();

  function loop(now) {
    const elapsed = now - cycleStart;
    const progress = (elapsed % totalMs) / totalMs;

    animateRhythm(progress);

    if (elapsed < inhaleMs) {
      const isCoherentCycle = cycleCount > 0 && cycleCount % 4 === 0;
      setState(isCoherentCycle ? "coherent" : "inhale");
    } else if (elapsed < totalMs) {
      setState("exhale");
    } else {
      cycleCount += 1;
      cycleStart = now;
      cycleText.textContent = `Cycle ${cycleCount}`;
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;
    setMode(mode);
  });
});

// init
setTimeout(() => {
  stateText.textContent = "Breathing…";
  cycleText.textContent = "Cycle 1";
  cycleCount = 1;
  setMode("coherence");
  startBreathing();
}, 700);
