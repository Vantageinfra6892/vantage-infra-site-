// ============================================================================
// VANTAGE INFRA — Interactive Simulation & Parallax Physics Engine
// ============================================================================

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initGlobalUtilities();
  initMobileNavigation();
  initDynamicCycleEngines();
  initInteractiveMaterialPhysics();
  initPremiumScrollObserver();
  initLimeSimulatorEngine();
});

function initGlobalUtilities() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initMobileNavigation() {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('main-nav');
  
  if (!navToggle || !mainNav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

function buildMaterialCycleSVG(stages, options = {}) {
  const { showLabels = false, centerLabel = '' } = options;
  const size = showLabels ? 240 : 200;
  const cx = size / 2, cy = size / 2;
  const r = showLabels ? 62 : 78;
  const labelOffset = showLabels ? 30 : 0;

  const angles = [-90, 0, 90, 180]; 
  const nodes = angles.map((deg, i) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
      dx: Math.cos(rad),
      dy: Math.sin(rad),
      label: stages[i]
    };
  });

  const nodeCircles = nodes.map(n => 
    `<circle class="cycle-node" cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="4.2"></circle>`
  ).join('');

  let labels = '';
  if (showLabels) {
    labels = nodes.map(n => {
      const lx = cx + n.dx * (r + labelOffset);
      const ly = cy + n.dy * (r + labelOffset);
      return `<text class="cycle-node-label" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">${n.label}</text>`;
    }).join('');
  }

  const center = centerLabel 
    ? `<text class="cycle-center-label" x="${cx}" y="${cy + 5}" text-anchor="middle">${centerLabel}</text>`
    : '';

  return `
    <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle class="cycle-ring" cx="${cx}" cy="${cy}" r="${r}"></circle>
      ${nodeCircles}
      ${labels}
      ${center}
    </svg>
  `;
}

function initDynamicCycleEngines() {
  const WATER_STAGES = ['Evaporation', 'Condensation', 'Precipitation', 'Collection'];
  const LIME_STAGES = ['Limestone', 'Quicklime', 'Slaked lime', 'Carbonation'];

  const cycleMark = document.getElementById('cycleMark');
  const dividerMark = document.getElementById('dividerMark');
  const dividerText = document.getElementById('dividerText');
  const cycleDivider = document.getElementById('cycleDivider');

  if (cycleMark) cycleMark.innerHTML = buildMaterialCycleSVG(WATER_STAGES, { showLabels: true });
  if (dividerMark) dividerMark.innerHTML = buildMaterialCycleSVG(WATER_STAGES, { showLabels: false });

  const WATER_PHRASE = 'A cycle managed, not fought';
  const LIME_PHRASE = 'A cycle that builds the wall itself';
  let dividerFlipped = false;
  let ticking = false;

  function updateDivider() {
    if (!cycleDivider || !dividerMark || !dividerText) return;
    const rect = cycleDivider.getBoundingClientRect();
    const mid = window.innerHeight * 0.55;
    const shouldFlip = rect.top < mid && rect.bottom > 0;

    if (shouldFlip !== dividerFlipped) {
      dividerFlipped = shouldFlip;
      cycleDivider.classList.toggle('is-flipped', dividerFlipped);
      dividerMark.classList.toggle('is-lime', dividerFlipped);

      dividerText.classList.add('is-fading');
      setTimeout(() => {
        dividerText.textContent = dividerFlipped ? LIME_PHRASE : WATER_PHRASE;
        dividerText.classList.remove('is-fading');
      }, 300);
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateDivider);
      ticking = true;
    }
  }, { passive: true });
}

function initInteractiveMaterialPhysics() {
  const cards = document.querySelectorAll('.service-card, .finish-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function initPremiumScrollObserver() {
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));
}

function initLimeSimulatorEngine() {
  const deck = document.getElementById('limeSimulationDeck');
  if (!deck) return;

  const tabs = deck.querySelectorAll('.sim-tab-btn');
  const nodes = deck.querySelectorAll('.sim-step-node');
  const actionBtn = document.getElementById('btnTriggerAction');
  const readout = document.getElementById('canvasReadout');
  const canvas = document.getElementById('carbonationCanvas');
  const ctx = canvas.getContext('2d');

  let currentFinish = 'araish';
  let activeStep = 1;
  let particles = [];
  let animationId = null;
  let crystallizationProgress = 0;

  const formulaData = {
    araish: {
      title: "Araish Formulation System",
      steps: [
        "Coarse structural slaked lime base with screened sharp sand parameters.",
        "Intermediate level leveling matrix engineered to distribute structural stresses.",
        "Micro-filtered marble-dust lime burnished layer absorbing room CO₂ molecules."
      ],
      actionText: "Inject CO₂ Matrix",
      successText: "Crystallization Matrix Complete: Calcium Carbonate Layer Stable"
    },
    tadelakt: {
      title: "Tadelakt Sealing System",
      steps: [
        "Dense hydraulic base layer mix laid to form a compression-resistant shell.",
        "Mechanically compacted leveling lime layer built using traditional wooden float tooling.",
        "Burnished surface treated with olive soap solution to initiate waterproof sealing."
      ],
      actionText: "Simulate Moisture Load",
      successText: "Hydrophobic Reaction Stabilized: Moisture Sealing Fully Active"
    },
    floors: {
      title: "Seamless Lime Flooring",
      steps: [
        "Reinforced load-bearing sub-base layer structured to isolate shifting stresses.",
        "High-density mineral aggregate map laid evenly for foundational thickness.",
        "Polished structural lime floor paste burnished down to a seamless stone-like floor sheet."
      ],
      actionText: "Apply Heavy Structural Stress",
      successText: "Compression Integrity Peak: Carbonate Floor Sheet Fully Set"
    }
  };

  function updateInterface() {
    const data = formulaData[currentFinish];
    deck.querySelector('.sim-title').textContent = data.title;
    actionBtn.textContent = data.actionText;
    readout.textContent = "Status: Analytical Model Calibrated";
    
    document.getElementById('step-desc-1').textContent = data.steps[0];
    document.getElementById('step-desc-2').textContent = data.steps[1];
    document.getElementById('step-desc-3').textContent = data.steps[2];

    activeStep = 1;
    crystallizationProgress = 0;
    triggerStepSequence();
  }

  function triggerStepSequence() {
    nodes.forEach((node, i) => {
      node.classList.toggle('active', (i + 1) === activeStep);
    });

    document.getElementById('vizLayer1').classList.toggle('active', activeStep >= 1);
    document.getElementById('vizLayer2').classList.toggle('active', activeStep >= 2);
    document.getElementById('vizLayer3').classList.toggle('active', activeStep >= 3);

    if (activeStep < 3) {
      setTimeout(() => {
        activeStep++;
        triggerStepSequence();
      }, 1200);
    } else {
      initSimulationVisuals();
    }
  }

  function initSimulationVisuals() {
    particles = [];
    crystallizationProgress = 0;
    cancelAnimationFrame(animationId);

    const count = currentFinish === 'tadelakt' ? 70 : 45;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -30,
        r: Math.random() * 2 + 1.5,
        speed: Math.random() * 1.5 + 0.8,
        opacity: Math.random() * 0.5 + 0.5,
        crystallized: false
      });
    }
    runSimulationLoop();
  }

  function runSimulationLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allLocked = true;

    particles.forEach(p => {
      if (!p.crystallized) {
        p.y += p.speed;
        if (p.y > canvas.height - 30) {
          p.crystallized = true;
        }
        allLocked = false;
      } else {
        p.opacity = Math.min(1, p.opacity + 0.015);
      }

      ctx.beginPath();
      if (currentFinish === 'araish') {
        ctx.arc(p.x, p.y, p.crystallized ? p.r * 1.5 : p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.crystallized ? `rgba(187, 107, 58, ${p.opacity})` : `rgba(110, 100, 87, ${p.opacity})`;
      } else if (currentFinish === 'tadelakt') {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + 6);
        ctx.strokeStyle = p.crystallized ? `rgba(76, 107, 110, 0.15)` : `rgba(76, 107, 110, ${p.opacity})`;
        ctx.stroke();
      } else {
        ctx.rect(p.x, p.y, p.r * 2.5, p.r * 2.5);
        ctx.fillStyle = p.crystallized ? `rgba(126, 66, 34, ${p.opacity})` : `rgba(42, 37, 32, 0.25)`;
      }
      if (currentFinish !== 'tadelakt') ctx.fill();
    });

    if (allLocked && crystallizationProgress > 0) {
      readout.textContent = formulaData[currentFinish].successText;
      actionBtn.removeAttribute('disabled');
    } else {
      animationId = requestAnimationFrame(runSimulationLoop);
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFinish = tab.dataset.finish;
      updateInterface();
    });
  });

  actionBtn.addEventListener('click', () => {
    actionBtn.setAttribute('disabled', 'true');
    readout.textContent = "Status: Triggering Matrix Phase Reaction array...";
    crystallizationProgress = 1;
    initSimulationVisuals();
  });

  updateInterface();
}
