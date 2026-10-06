const state = {
  type: "Image",
  fileName: ""
};

const tabs = document.querySelectorAll(".media-tab");
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");
const uploadTitle = document.getElementById("uploadTitle");
const uploadHint = document.getElementById("uploadHint");
const analysisPanel = document.getElementById("analysisPanel");
const resultPanel = document.getElementById("resultPanel");
const analysisTitle = document.getElementById("analysisTitle");
const statusPill = document.getElementById("statusPill");
const analysisPercent = document.getElementById("analysisPercent");
const resultType = document.getElementById("resultType");
const resultTitle = document.getElementById("resultTitle");
const resultDescription = document.getElementById("resultDescription");
const resultScore = document.getElementById("resultScore");
const resetBtn = document.getElementById("resetBtn");
const scoreRingFill = document.querySelector(".score-ring-fill");
const progressFill = document.querySelector(".progress-fill");
const progressText = document.getElementById("analysisPercent");

const copy = {
  Image: {
    title: "Upload an image",
    hint: "Drop a JPG, PNG, WEBP or another image file here."
  },
  Video: {
    title: "Upload a video",
    hint: "Drop an MP4, MOV or another video file here."
  },
  Audio: {
    title: "Upload an audio file",
    hint: "Drop an MP3, WAV or another audio file here."
  }
};

function updateType(type) {
  state.type = type;

  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.type === type);
  });

  uploadTitle.textContent = copy[type].title;
  uploadHint.textContent = copy[type].hint;

  // Update analysis title
  analysisTitle.textContent = `Analyzing ${state.type.toLowerCase()}`;

  if (!analysisPanel.hidden || !resultPanel.hidden) {
    resetVerification();
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => updateType(tab.dataset.type));
});

browseBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) {
    state.fileName = file.name;
    startVerification(file.name);
  }
});

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("dragging");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragging");
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragging");
  const file = event.dataTransfer.files?.[0];
  if (file) {
    state.fileName = file.name;
    startVerification(file.name);
  }
});

function startVerification(fileName) {
  dropZone.hidden = true;
  resultPanel.hidden = true;
  analysisPanel.hidden = false;

  // Reset UI
  analysisPercent.textContent = "0%";
  statusPill.textContent = "Scanning";
  progressFill.style.background = `conic-gradient(from -90deg, var(--accent-cyan) 0%, var(--accent-cyan) 0%, var(--border-color) 0%)`;
  scoreRingFill.style.background = `conic-gradient(from -90deg, var(--accent-green) 0%, var(--accent-green) 0%, var(--border-color) 0%)`;

  const steps = [...document.querySelectorAll(".step")];
  steps.forEach((step) => step.classList.remove("done", "active"));

  let progress = 0;
  let scoreProgress = 0;
  let activeStep = 0;

  const timer = setInterval(() => {
    // Progress for analysis bar (0-100%)
    progress += Math.floor(Math.random() * 7) + 4;
    if (progress >= 100) progress = 100;

    analysisPercent.textContent = `${progress}%`;
    progressFill.style.background = `conic-gradient(from -90deg, var(--accent-cyan) 0%, var(--accent-cyan) ${progress}%, var(--border-color) ${progress}%)`;

    // Score progresses slightly slower (0-78% for this demo)
    if (progress < 100) {
      scoreProgress += Math.floor(Math.random() * 5) + 2;
      if (scoreProgress >= 78) scoreProgress = 78;
    } else {
      // Complete the score when analysis finishes
      if (scoreProgress < 78) {
        scoreProgress += 2;
        if (scoreProgress >= 78) scoreProgress = 78;
      }
    }

    scoreRingFill.style.background = `conic-gradient(from -90deg, var(--accent-green) 0%, var(--accent-green) ${scoreProgress}%, var(--border-color) ${scoreProgress}%)`;

    // Step activation logic
    if (progress >= 25 && activeStep < 1) {
      activeStep = 1;
      steps[0].classList.add("done");
      steps[1].classList.add("active");
    }

    if (progress >= 62 && activeStep < 2) {
      activeStep = 2;
      steps[1].classList.add("done");
      steps[2].classList.add("active");
    }

    if (progress === 100) {
      steps[2].classList.add("done");
      statusPill.textContent = "Complete";
      clearInterval(timer);

      setTimeout(() => {
        analysisPanel.hidden = true;
        resultPanel.hidden = false;
        resultType.textContent = state.type;
        resultScore.textContent = `${scoreProgress}`;

        // Set result messaging based on score
        if (scoreProgress < 30) {
          resultTitle.textContent = "Likely Authentic Content";
          resultDescription.textContent = "TrustNova identified few signals that may indicate manipulation or synthetic generation. The content appears mostly authentic.";
        } else if (scoreProgress < 70) {
          resultTitle.textContent = "Potentially Synthetic Content Detected";
          resultDescription.textContent = "TrustNova identified signals that may indicate manipulation or synthetic generation. Review the assessment before deciding what to trust or share.";
        } else {
          resultTitle.textContent = "Likely Synthetic Content Detected";
          resultDescription.textContent = "TrustNova identified strong signals that suggest manipulation or synthetic generation. Review the assessment carefully before deciding what to trust or share.";
        }
      }, 550);
    }
  }, 120);
}

resetBtn.addEventListener("click", resetVerification);

function resetVerification() {
  analysisPanel.hidden = true;
  resultPanel.hidden = true;
  dropZone.hidden = false;
  fileInput.value = "";
  state.fileName = "";

  // Reset UI to initial state
  analysisPercent.textContent = "0%";
  statusPill.textContent = "Scanning";
  progressFill.style.background = `conic-gradient(from -90deg, var(--accent-cyan) 0%, var(--accent-cyan) 0%, var(--border-color) 0%)`;
  scoreRingFill.style.background = `conic-gradient(from -90deg, var(--accent-green) 0%, var(--accent-green) 0%, var(--border-color) 0%)`;

  const steps = [...document.querySelectorAll(".step")];
  steps.forEach((step) => step.classList.remove("done", "active"));
  steps[0].classList.add("active");
}

document.getElementById("year").textContent = new Date().getFullYear();

// Reveal animations for sections
const revealItems = document.querySelectorAll(".info-card, .product-card, .how-step, .signal-row, .vision, .closing-card");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.animate(
      [
        { opacity: 0, transform: "translateY(20px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      {
        duration: 500,
        easing: "cubic-bezier(.2,.8,.2,1)",
        fill: "forwards"
      }
    );
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1 });

revealItems.forEach((item) => {
  item.style.opacity = "0";
  observer.observe(item);
});

// Keyboard shortcut: Escape to reset
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && (!analysisPanel.hidden || !resultPanel.hidden)) {
    resetVerification();
  }
});