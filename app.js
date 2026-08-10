// Smooth Canvas Scroll Animation Engine
const FRAME_COUNT = 144;
const getFramePath = (index) => {
  const paddedIndex = String(index).padStart(3, '0');
  return `/frames/ezgif-frame-${paddedIndex}.jpg`;
};

// DOM Elements (Lazily & Safely Initialized)
let canvas = null;
let ctx = null;
let loader = null;
let loaderBar = null;
let loaderPercent = null;

function initDOMElements() {
  canvas = document.getElementById('animation-canvas');
  if (canvas) {
    ctx = canvas.getContext('2d', { alpha: false });
  }
  loader = document.getElementById('loader');
  loaderBar = document.getElementById('loader-bar');
  loaderPercent = document.getElementById('loader-percent');
}

// Animation State
const images = [];
let loadedCount = 0;
let targetFrameIndex = 0;
let currentFrameIndex = 0;
let lastDrawnFrameIndex = -1;
let isLoaded = false;


// Preload All 144 Frames
function preloadImages() {
  return new Promise((resolve) => {
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      
      const handleLoad = () => {
        loadedCount++;
        updateProgress();
        if (loadedCount === FRAME_COUNT) {
          onPreloadComplete();
          resolve();
        }
      };

      img.onload = handleLoad;
      img.onerror = () => {
        console.warn(`Frame failed to load: ${getFramePath(i)}`);
        handleLoad();
      };

      images.push(img);
    }
  });
}

function updateProgress() {
  const percent = Math.floor((loadedCount / FRAME_COUNT) * 100);
  if (!loaderBar) loaderBar = document.getElementById('loader-bar');
  if (!loaderPercent) loaderPercent = document.getElementById('loader-percent');
  if (loaderBar) loaderBar.style.width = `${percent}%`;
  if (loaderPercent) loaderPercent.textContent = `${percent}%`;
}

function onPreloadComplete() {
  isLoaded = true;
  if (!loader) loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
  resizeCanvas();
  updateScrollTarget();
  renderFrame(0, true);
}

// Projects Database
const PROJECTS_DB = {
  "1": {
    title: "Cartora E-Commerce Application",
    image: "./images/project1.png",
    description: "Next-generation e-commerce web application engineered with a futuristic product discovery experience, curated collections, real-time cart orchestration, and lightning-fast checkout delivery.",
    stack: ["PHP", "JavaScript", "Tailwind CSS", "REST API"],
    live: "https://example.com/cartora-demo",
    github: "https://github.com"
  },
  "2": {
    title: "CampusHub Campus Portal",
    image: "./images/project2.png",
    description: "Comprehensive university campus management portal for monitoring administrative metrics, registered events, operational system pipelines, and official administrative announcements.",
    stack: ["Java", "Spring Boot", "HTML5/CSS3", "JavaScript"],
    live: "https://example.com/campushub-portal",
    github: "https://github.com"
  },
  "3": {
    title: "Aura Design System",
    image: "./images/card_product.png",
    description: "Comprehensive design token system and UI kit used across mobile & web applications for scalable interface building and cohesive visual branding.",
    stack: ["Figma", "UI/UX", "JavaScript", "Design Tokens", "CSS3"],
    live: "https://example.com/aura-system",
    github: "https://github.com"
  },


  "4": {
    title: "Cloud Infrastructure Portal",
    image: "./images/card_jacket.png",
    description: "Server management and resource monitoring tool for DevOps teams with real-time system diagnostics and automated alerting.",
    stack: ["PHP", "HTML/CSS", "JavaScript", "Linux", "Docker"],
    live: "https://example.com/cloud-portal",
    github: "https://github.com"
  },
  "5": {
    title: "Fintech Payment Gateway",
    image: "./images/card_headphones.png",
    description: "Secure microservice for payment orchestration supporting multi-currency transactions and PCI-DSS compliance.",
    stack: ["Java", "JS", "REST API", "Microservices", "PostgreSQL"],
    live: "https://example.com/fintech-pay",
    github: "https://github.com"
  },
  "6": {
    title: "Neobank Mobile UI",
    image: "./images/card_product.png",
    description: "Next-generation mobile banking experience designed for iOS & Android with sleek dark mode aesthetics.",
    stack: ["Figma", "UI/UX", "Mobile Design", "Prototyping"],
    live: "https://example.com/neobank-app",
    github: "https://github.com"
  }
};

// Draw canvas frame maintaining aspect ratio (object-fit: contain)
function drawImageContain(img) {
  if (!canvas) canvas = document.getElementById('animation-canvas');
  if (!canvas) return;
  if (!ctx) ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;
  
  const imgAspect = imgWidth / imgHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, drawX, drawY;

  if (canvasAspect > imgAspect) {
    drawHeight = canvasHeight;
    drawWidth = canvasHeight * imgAspect;
    drawX = (canvasWidth - drawWidth) / 2;
    drawY = 0;
  } else {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgAspect;
    drawX = 0;
    drawY = (canvasHeight - drawHeight) / 2;
  }

  // Dark background behind canvas image
  ctx.fillStyle = '#070709';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw current image frame
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}

// Handle Canvas Sizing and DPR
function resizeCanvas() {
  if (!canvas) canvas = document.getElementById('animation-canvas');
  if (!canvas) return;
  if (!ctx) ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const frameToRender = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(currentFrameIndex)));
  renderFrame(frameToRender, true);
}


// Render specified frame index
function renderFrame(index, force = false) {
  if (!images[index]) return;
  if (!force && index === lastDrawnFrameIndex) return;

  drawImageContain(images[index]);
  lastDrawnFrameIndex = index;
}

// Map scroll position to frame index
function updateScrollTarget() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const maxScroll = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  ) - window.innerHeight;
  
  if (maxScroll <= 0) {
    targetFrameIndex = 0;
    return;
  }

  const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));
  targetFrameIndex = scrollFraction * (FRAME_COUNT - 1);
}

// Main Animation Loop with smooth Lerping
function animationLoop() {
  if (isLoaded) {
    const diff = targetFrameIndex - currentFrameIndex;
    
    // Smooth lerp interpolation factor (0.08 for buttery cinematic feel)
    if (Math.abs(diff) > 0.0005) {
      currentFrameIndex += diff * 0.08;
    } else {
      currentFrameIndex = targetFrameIndex;
    }

    const frameToDraw = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(currentFrameIndex)));
    renderFrame(frameToDraw);
  }

  requestAnimationFrame(animationLoop);
}


// Active Nav Link Update on Scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 250;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (navLink) {
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}

// Event Listeners for Canvas Engine
window.addEventListener('scroll', () => {
  updateScrollTarget();
  updateActiveNavLink();
}, { passive: true });

window.addEventListener('resize', resizeCanvas);
window.addEventListener('touchmove', updateScrollTarget, { passive: true });
window.addEventListener('wheel', updateScrollTarget, { passive: true });

// Initialize Engine
async function init() {
  requestAnimationFrame(animationLoop);
  await preloadImages();
}

init();

/* ==========================================================================
   UI ARCHITECTURE & INTERACTIVES (8-VIEW MODULE)
   ========================================================================== */




// 1. Typewriter Effect Logic for Hero Section
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter-text');
  if (!typewriterElement) return;

  const words = ["Software Engineer", "UI/UX Designer", "Problem Solver"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const delayBetweenWords = 1800;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let timeoutSpeed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      timeoutSpeed = delayBetweenWords;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      timeoutSpeed = 400;
    }

    setTimeout(type, timeoutSpeed);
  }

  type();
}

// 2. Intersection Observer Scroll Fade-Up & Progress Bar Animation
function initScrollObserver() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('.progress-bar-fill').forEach(fill => {
      fill.style.width = fill.getAttribute('data-progress');
    });
    return;
  }


  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Trigger progress bars inside intersecting section
        const progressBars = entry.target.querySelectorAll('.progress-bar-fill');
        progressBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-progress') || '85%';
          bar.style.width = targetWidth;
        });
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}



// 3. Modal Manager System (Views 2–8)
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    // Restore scrolling if no other modals are open
    const openModals = document.querySelectorAll('.modal-overlay:not(.hidden), .lightbox-overlay:not(.hidden)');
    if (openModals.length <= 1) {
      document.body.style.overflow = '';
    }
  }
}

function initModalHandlers() {
  // Triggers for View 2 (CV Modal)
  ['nav-show-cv-btn', 'hero-show-cv-btn', 'about-show-cv-btn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('cv-modal');
      });
    }
  });

  // CV PDF Download Simulation
  const downloadPdfBtn = document.getElementById('download-cv-pdf-btn');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Triggers for View 3 (All Projects Modal)
  ['hero-view-projects-btn', 'view-all-projects-btn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('all-projects-modal');
      });
    }
  });

  // Category Filter in View 3
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('#all-projects-grid .project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterCategory = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // View 4: Single Project Detail Binding
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card[data-project-id]');
    if (card) {
      const projectId = card.getAttribute('data-project-id');
      const projectData = PROJECTS_DB[projectId];
      const cardImg = card.querySelector('img');

      if (projectData) {
        document.getElementById('detail-project-title').textContent = projectData.title;
        const imgEl = document.getElementById('detail-project-img');
        if (cardImg && cardImg.getAttribute('src')) {
          imgEl.src = cardImg.getAttribute('src');
        } else {
          imgEl.src = projectData.image;
        }
        document.getElementById('detail-project-desc').textContent = projectData.description;

        const stackContainer = document.getElementById('detail-project-stack');
        stackContainer.innerHTML = projectData.stack.map(tech => `<span class="tag">${tech}</span>`).join('');

        document.getElementById('detail-live-link').href = projectData.live;
        document.getElementById('detail-github-link').href = projectData.github;

        openModal('project-detail-modal');
      }
    }
  });


  // View 5: Gallery Modal Trigger
  const viewFullGalleryBtn = document.getElementById('view-full-gallery-btn');
  if (viewFullGalleryBtn) {
    viewFullGalleryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('gallery-modal');
    });
  }

  // View 6: Add Feedback Form Trigger
  const openFeedbackBtn = document.getElementById('open-feedback-form-btn');
  if (openFeedbackBtn) {
    openFeedbackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('feedback-modal');
    });
  }

  // Close buttons with data-close-modal attribute
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetModalId = btn.getAttribute('data-close-modal');
      closeModal(targetModalId);
    });
  });

  // Backdrop click to close modals
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  // Keyboard ESC close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
        closeModal(modal.id);
      });
      closeLightbox();
    }
  });
}

// 4. View 8: Image Lightbox Functionality
function initLightbox() {
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('lightbox-close-btn');

  function openLightbox(src, title, desc) {
    if (!lightboxModal) return;
    lightboxImg.src = src;
    lightboxTitle.textContent = title || '';
    lightboxDesc.textContent = desc || '';
    lightboxModal.classList.remove('hidden');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  window.closeLightbox = function() {
    if (!lightboxModal) return;
    lightboxModal.classList.add('hidden');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Bind all elements with data-lightbox-src
  document.addEventListener('click', (e) => {
    const lightboxTrigger = e.target.closest('[data-lightbox-src]');
    if (lightboxTrigger) {
      const src = lightboxTrigger.getAttribute('data-lightbox-src');
      const title = lightboxTrigger.getAttribute('data-lightbox-title');
      const desc = lightboxTrigger.getAttribute('data-lightbox-desc');
      openLightbox(src, title, desc);
    }
  });
}

// 5. Feedback Carousel Logic (View 1)
function initFeedbackCarousel() {
  const slides = document.querySelectorAll('#carousel-wrapper .carousel-slide');
  const dots = document.querySelectorAll('#carousel-dots .dot');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let autoTimer;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, 6000);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAuto(); });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAuto();
    });
  });

  startAuto();
}

// 6. Form Submission Handlers (View 6 Form & Footer Email -> View 7 Success Modal)
function initFormHandlers() {
  // Star rating handler in Feedback Form
  const starBtns = document.querySelectorAll('#rating-stars .star-btn');
  let selectedRating = 5;

  starBtns.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-rating'));
      starBtns.forEach((s, idx) => {
        if (idx < selectedRating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });

  // Feedback Form Submit (View 6)
  const addFeedbackForm = document.getElementById('add-feedback-form');
  if (addFeedbackForm) {
    addFeedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('feedback-name').value;
      const role = document.getElementById('feedback-role').value || 'Verified Client';
      const message = document.getElementById('feedback-message').value;

      // Dynamically insert new feedback card into Feedback Row (Image 4 format)
      const feedbackRow = document.querySelector('.feedback-cards-row');

      if (feedbackRow) {
        const newCard = document.createElement('div');
        newCard.className = 'feedback-card-v4';
        newCard.innerHTML = `
          <p class="v4-quote">"${message}"</p>
          <div class="v4-author-box">
            <div class="v4-avatar">
              <img src="./images/card_product.png" alt="${name}">
            </div>
            <div>
              <div class="v4-name">${name}</div>
              <div class="v4-role">${role}</div>
            </div>
          </div>
        `;
        feedbackRow.appendChild(newCard);
      }

      addFeedbackForm.reset();
      closeModal('feedback-modal');
      openModal('success-modal');
    });
  }


  // Footer Newsletter Form Submit
  const newsletterForm = document.getElementById('footer-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.reset();
      openModal('success-modal');
    });
  }
}

function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBtn.classList.toggle('open');
      navLinks.classList.toggle('active');
    });

    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
        toggleBtn.classList.remove('open');
        navLinks.classList.remove('active');
      }
    });
  }
}

// Boot Initializer Function (Guaranteed Execution regardless of load timing)
function bootApp() {
  initDOMElements();
  preloadImages();

  // Safety fallback: Hide preloader screen after 1.2s max to prevent any loading lock
  setTimeout(() => {
    if (!loader) loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    isLoaded = true;
  }, 1200);

  // Window Event Listeners for Canvas
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', updateScrollTarget, { passive: true });
  
  // Start Canvas Animation Loop
  requestAnimationFrame(animationLoop);

  // Initialize Portfolio UI Modules
  initMobileNav();
  initTypewriter();
  initScrollObserver();
  initModalHandlers();
  initLightbox();
  initFeedbackCarousel();
  initFormHandlers();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}





