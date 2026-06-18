/* ============================================================================
   VANTAGE INFRA — BRAND INTERACTIVE MATERIAL & LAB ENGINE
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. INITIALIZE INTERACTIVE LIME SIMULATOR TABS
  initLimeSimulator();

  // 2. INITIALIZE AMBIENT LIME CARBONATION PARTICLE FIELD
  initCarbonationField();
});

/**
 * Handles Tab Switching and Cross-Section Layer Highlights
 */
function initLimeSimulator() {
  const tabButtons = document.querySelectorAll('.sim-tab-btn');
  const stepNodes = document.querySelectorAll('.sim-step-node');
  const layerBlocks = document.querySelectorAll('.layer-block');
  const readoutStatus = document.querySelector('.canvas-readout');

  // Technical profile content maps to instantly shift context dynamically
  const profiles = {
    araish: {
      status: "System Analysis: CO₂ Processing Active [Araish Profile Loaded]",
      layers: ["01. Thappi Structural Bed [Coarse Aggregate]", "02. Lohi Equalization Layer [Medium Sand]", "03. Pure Burnished Shell Face [Marble Dust Finish]"]
    },
    floors: {
      status: "System Analysis: Elastic-Free Matrix Balanced [Lime Floor Profile Loaded]",
      layers: ["01. Subgrade Lime Concrete Base", "02. Stabilized Intermediary Aggregate Grid", "03. Seamless Hydrophobic Burnished Flooring"]
    }
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states on buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedFinish = btn.getAttribute('data-finish');
      
      // Update the technical status readout layout
      if (readoutStatus && profiles[selectedFinish]) {
        readoutStatus.textContent = profiles[selectedFinish].status;
        
        // Update the textual labels inside the visual cross section blocks
        const labels = profiles[selectedFinish].layers;
        if (layerBlocks.length === 3) {
          layerBlocks[0].querySelector('span').textContent = labels[0];
          layerBlocks[1].querySelector('span').textContent = labels[1];
          layerBlocks[2].querySelector('span').textContent = labels[2];
        }
      }

      // Quick visual stagger animation trigger on the layer stacks
      layerBlocks.forEach((block, index) => {
        block.style.opacity = '0.3';
        setTimeout(() => {
          block.style.opacity = '1';
        }, index * 120);
      });
    });
  });
}

/**
 * Renders an ambient canvas animation mimicking Slaked Lime absorbing ambient CO₂
 */
function initCarbonationField() {
  const canvas = document.getElementById('carbonationCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Track layout resize matrices gracefully
  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 180;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Generate hyper-minimal particles representing chemical transformation nodes
  const particles = [];
  const particleCount = 24;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height + canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speedY: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.5 + 0.2,
      oscillateSpeed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI
    });
  }

  // Pure mathematical animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle mechanical bonding connection gridlines
    ctx.strokeStyle = 'rgba(214, 203, 179, 0.15)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
    }
    ctx.stroke();

    // Render individual carbon particles
    particles.forEach(p => {
      p.y -= p.speedY;
      p.angle += p.oscillateSpeed;
      // Slight horizontal drift math
      p.x += Math.sin(p.angle) * 0.15;

      // Recycle nodes once they hit the surface threshold limit
      if (p.y < 20) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#753D1D'; // Pure mineral accent tint tone
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}
