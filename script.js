/**
 * TrustNova — Interactive Frontend Simulation
 * Recreates the complete verification workflow as specified in the design reference.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current prototype state
  const state = {
    mediaType: 'Image',
    fileName: 'city-skyline.jpg',
    fileSize: '2.4 MB',
    fileDataUrl: null,
    isProcessing: false,
    score: 78
  };

  // DOM Elements - Navigation
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.style.display = isExpanded ? 'none' : 'flex';
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '100%';
      navMenu.style.left = '0';
      navMenu.style.width = '100%';
      navMenu.style.background = 'rgba(6, 11, 17, 0.98)';
      navMenu.style.padding = '20px';
      navMenu.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    });
  }

  // DOM Elements - Media Selection Tabs
  const verifierTabs = document.querySelectorAll('.verifier-tab');
  const dropTabs = document.querySelectorAll('.dtab');
  const productCards = document.querySelectorAll('.product-type-card');

  // Input & Buttons
  const fileInput = document.getElementById('prototypeFileInput');
  const chooseFileBtn1 = document.getElementById('chooseFileBtn1');
  const changeFileBtn = document.getElementById('changeFileBtn');
  const viewResultBtn = document.getElementById('viewResultBtn');
  const runAnotherBtn = document.getElementById('runAnotherBtn');

  // Preview elements
  const currentFileName = document.getElementById('currentFileName');
  const currentFileSize = document.getElementById('currentFileSize');
  const previewCanvas = document.getElementById('previewCanvas');
  const generalDropZone = document.getElementById('generalDropZone');

  // Stages & Progress
  const stage1Bar = document.getElementById('stage1Bar');
  const stage1Pct = document.getElementById('stage1Pct');
  const stage2Bar = document.getElementById('stage2Bar');
  const stage2Pct = document.getElementById('stage2Pct');
  const stage3Bar = document.getElementById('stage3Bar');
  const stage3Pct = document.getElementById('stage3Pct');
  const liveStatusText = document.getElementById('liveStatusText');

  // Panels
  const workingPanel = document.getElementById('verifierWorkingPanel');
  const resultPanel = document.getElementById('verifierResultPanel');

  // Results
  const resMediaType = document.getElementById('resMediaType');
  const resScoreNum = document.getElementById('resScoreNum');
  const resDialCircle = document.getElementById('resDialCircle');
  const footerYear = document.getElementById('footerYear');

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // Sync tab active state across sections
  function setMediaType(type) {
    state.mediaType = type;

    // Update Verifier tabs
    verifierTabs.forEach(tab => {
      const match = tab.dataset.type === type;
      tab.classList.toggle('active', match);
      tab.setAttribute('aria-selected', match);
    });

    // Update Drop tabs
    dropTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.type === type);
    });

    // Update Product list cards
    productCards.forEach(card => {
      card.classList.toggle('active', card.dataset.type === type);
    });

    // Update demo placeholders if using defaults
    if (!state.fileDataUrl) {
      if (type === 'Video') {
        state.fileName = 'interview-clip.mp4';
        state.fileSize = '14.8 MB';
        previewCanvas.style.background = 'linear-gradient(180deg, #102a43 0%, #06111d 100%)';
      } else if (type === 'Audio') {
        state.fileName = 'voice-sample.wav';
        state.fileSize = '3.1 MB';
        previewCanvas.style.background = 'linear-gradient(180deg, #162438 0%, #091321 100%)';
      } else {
        state.fileName = 'city-skyline.jpg';
        state.fileSize = '2.4 MB';
        previewCanvas.style.background = 'linear-gradient(180deg, #182a42 0%, #101c2b 55%, #080f18 100%)';
      }
      currentFileName.textContent = state.fileName;
      currentFileSize.textContent = state.fileSize;
    }

    startAnalysisSimulation();
  }

  // Wire up tabs
  verifierTabs.forEach(tab => {
    tab.addEventListener('click', () => setMediaType(tab.dataset.type));
  });

  dropTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setMediaType(tab.dataset.type);
      document.getElementById('interactive-verifier')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  productCards.forEach(card => {
    card.addEventListener('click', () => {
      setMediaType(card.dataset.type);
      document.getElementById('interactive-verifier')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // File Upload Handlers
  if (chooseFileBtn1) {
    chooseFileBtn1.addEventListener('click', () => fileInput.click());
  }

  if (changeFileBtn) {
    changeFileBtn.addEventListener('click', () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUploadedFile(file);
      }
    });
  }

  function handleUploadedFile(file) {
    state.fileName = file.name;
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    state.fileSize = `${sizeInMB} MB`;
    currentFileName.textContent = state.fileName;
    currentFileSize.textContent = state.fileSize;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        state.fileDataUrl = event.target.result;
        previewCanvas.style.backgroundImage = `url(${state.fileDataUrl})`;
        previewCanvas.style.backgroundSize = 'cover';
        previewCanvas.style.backgroundPosition = 'center';
      };
      reader.readAsDataURL(file);
    } else {
      state.fileDataUrl = null;
    }

    // Scroll to interactive verifier & start analysis
    document.getElementById('interactive-verifier')?.scrollIntoView({ behavior: 'smooth' });
    startAnalysisSimulation();
  }

  // Drag and drop for dropzone
  if (generalDropZone) {
    ['dragenter', 'dragover'].forEach(name => {
      generalDropZone.addEventListener(name, (e) => {
        e.preventDefault();
        generalDropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      generalDropZone.addEventListener(name, (e) => {
        e.preventDefault();
        generalDropZone.classList.remove('dragover');
      });
    });

    generalDropZone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleUploadedFile(file);
      }
    });
  }

  // Animated Analysis Simulation
  let progressInterval = null;

  function startAnalysisSimulation() {
    if (progressInterval) clearInterval(progressInterval);
    
    // Switch to working panel if on result
    workingPanel.hidden = false;
    resultPanel.hidden = true;

    // Reset progress
    stage1Bar.style.width = '0%';
    stage1Pct.textContent = '0%';
    stage2Bar.style.width = '0%';
    stage2Pct.textContent = '0%';
    stage3Bar.style.width = '0%';
    stage3Pct.textContent = '0%';
    liveStatusText.textContent = `Extracting ${state.mediaType.toLowerCase()} signals...`;

    let p1 = 0;
    let p2 = 0;
    let p3 = 0;

    progressInterval = setInterval(() => {
      // Stage 1 fills first to ~37%
      if (p1 < 37) {
        p1 += 4;
        if (p1 > 37) p1 = 37;
        stage1Bar.style.width = `${p1}%`;
        stage1Pct.textContent = `${p1}%`;
      }

      // Stage 2 fills to ~68%
      if (p1 >= 25 && p2 < 68) {
        p2 += 5;
        if (p2 > 68) p2 = 68;
        stage2Bar.style.width = `${p2}%`;
        stage2Pct.textContent = `${p2}%`;
        liveStatusText.textContent = 'Comparing content-level signals...';
      }

      // Stage 3 fills to 100%
      if (p2 >= 50 && p3 < 100) {
        p3 += 6;
        if (p3 > 100) p3 = 100;
        stage3Bar.style.width = `${p3}%`;
        stage3Pct.textContent = `${p3}%`;
      }

      if (p1 >= 37 && p2 >= 68 && p3 >= 100) {
        clearInterval(progressInterval);
        liveStatusText.textContent = 'Analysis complete. Ready to review.';
      }
    }, 40);
  }

  // View Result button click
  if (viewResultBtn) {
    viewResultBtn.addEventListener('click', showResultView);
  }

  function showResultView() {
    workingPanel.hidden = true;
    resultPanel.hidden = false;

    // Update Result details
    resMediaType.textContent = state.mediaType;
    resScoreNum.textContent = state.score;
    
    // Animate circular score dial
    resDialCircle.setAttribute('stroke-dasharray', '0, 100');
    setTimeout(() => {
      resDialCircle.setAttribute('stroke-dasharray', `${state.score}, 100`);
    }, 50);
  }

  // Reset / Run Another Check
  if (runAnotherBtn) {
    runAnotherBtn.addEventListener('click', () => {
      resultPanel.hidden = true;
      workingPanel.hidden = false;
      startAnalysisSimulation();
    });
  }

  // Keyboard shortcut: Escape to reset
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !resultPanel.hidden) {
      resultPanel.hidden = true;
      workingPanel.hidden = false;
      startAnalysisSimulation();
    }
  });

  // Initial trigger
  startAnalysisSimulation();
});