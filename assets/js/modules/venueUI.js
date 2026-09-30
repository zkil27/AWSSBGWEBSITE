/**
 * venueUI.js — SCD South Summit 2026
 * Handles interactive enhancements for the Venue section:
 * - Multi-image interactive gallery & carousel (arrows, tabs, touch swipe, keyboard)
 * - Space switching linked with floor directory rows
 * - One-click address copy to clipboard
 */

export function initVenueUI() {
  initVenueCopy();
  initVenueGallery();
}

/**
 * Copy Venue Address to Clipboard
 */
function initVenueCopy() {
  const copyBtn = document.getElementById('btnCopyVenueAddr');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const address = "Biñan People's Center Auditorium, Biñan, Laguna, Philippines";
    const labelEl = document.getElementById('btnCopyText');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address).then(() => {
        if (labelEl) {
          const original = labelEl.textContent;
          labelEl.textContent = 'Address Copied';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            labelEl.textContent = original;
            copyBtn.classList.remove('copied');
          }, 2400);
        }
      }).catch(() => {
        fallbackCopy(address, labelEl, copyBtn);
      });
    } else {
      fallbackCopy(address, labelEl, copyBtn);
    }
  });
}

function fallbackCopy(text, labelEl, btnEl) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    if (labelEl) {
      const original = labelEl.textContent;
      labelEl.textContent = 'Address Copied';
      btnEl.classList.add('copied');
      setTimeout(() => {
        labelEl.textContent = original;
        btnEl.classList.remove('copied');
      }, 2400);
    }
  } catch (err) {
    window.open("https://www.google.com/maps/place/Bi%C3%B1an+People's+Center+Auditorium", "_blank");
  }
}

/**
 * Multi-Image Venue Gallery & Carousel — Concept B Editorial Split
 */
function initVenueGallery() {
  const gallery = document.getElementById('venueGallery');
  if (!gallery) return;

  const slides = Array.from(gallery.querySelectorAll('.venue-gallery-slide'));
  if (slides.length === 0) return;

  const prevBtn = document.getElementById('venuePrevBtn');
  const nextBtn = document.getElementById('venueNextBtn');
  const pauseBtn = document.getElementById('venuePauseBtn');
  const counterEl = document.getElementById('venueGalleryCounter');
  const captionEl = document.getElementById('venueCanvasCaption');
  const spaceItems = Array.from(document.querySelectorAll('.venue-space-row, .venue-space-item, .venue-floor-clickable'));
  const mediaStage = gallery.closest('.venue-media-stage') || gallery;

  let currentIndex = 0;
  const total = slides.length;
  let autoTimer = null;
  const AUTO_INTERVAL_MS = 5000;
  let isUserPaused = false;
  let isHoveredOrFocused = false;

  // If only 1 image, hide navigation buttons
  if (total <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (counterEl) counterEl.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'none';
    return;
  }

  function updatePauseButtonUI() {
    if (!pauseBtn) return;
    if (isUserPaused) {
      pauseBtn.classList.add('is-paused');
      pauseBtn.classList.remove('is-playing');
      pauseBtn.setAttribute('aria-label', 'Resume slideshow (5s interval)');
      pauseBtn.setAttribute('title', 'Resume slideshow (5s interval)');
      pauseBtn.setAttribute('aria-pressed', 'true');
    } else {
      pauseBtn.classList.remove('is-paused');
      pauseBtn.classList.add('is-playing');
      pauseBtn.setAttribute('aria-label', 'Pause slideshow');
      pauseBtn.setAttribute('title', 'Pause slideshow (5s interval)');
      pauseBtn.setAttribute('aria-pressed', 'false');
    }
  }

  function toggleUserPause() {
    isUserPaused = !isUserPaused;
    if (isUserPaused) {
      stopAutoTimer();
    } else {
      startAutoTimer();
    }
    updatePauseButtonUI();
  }

  function goToSlide(newIndex) {
    if (newIndex < 0) {
      currentIndex = total - 1;
    } else if (newIndex >= total) {
      currentIndex = 0;
    } else {
      currentIndex = newIndex;
    }

    const activeSlide = slides[currentIndex];

    // 1. Update slides active state
    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    // 2. Update caption
    if (captionEl && activeSlide) {
      captionEl.innerHTML = activeSlide.dataset.caption || activeSlide.dataset.label || '';
    }

    // 3. Update counter
    if (counterEl) {
      const curStr = String(currentIndex + 1).padStart(2, '0');
      const totStr = String(total).padStart(2, '0');
      counterEl.textContent = `${curStr} / ${totStr}`;
    }

    // 4. Update corresponding space item highlight
    spaceItems.forEach(item => {
      const targetIdx = parseInt(item.dataset.venueTarget, 10);
      const isActive = (targetIdx === currentIndex);
      item.classList.toggle('active', isActive);
      item.classList.toggle('active-floor', isActive);
      item.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // 5. Lazy-load interactive map iframe on demand when Slide 4 is viewed
    if (activeSlide && activeSlide.classList.contains('venue-map-slide')) {
      const mapIframe = activeSlide.querySelector('iframe');
      if (mapIframe && mapIframe.dataset.src && (!mapIframe.src || mapIframe.src === 'about:blank' || mapIframe.getAttribute('src') === 'about:blank')) {
        mapIframe.src = mapIframe.dataset.src;
      }
    }
  }

  // Prev / Next button clicks
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentIndex - 1);
      if (!isUserPaused) {
        restartAutoTimer();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentIndex + 1);
      if (!isUserPaused) {
        restartAutoTimer();
      }
    });
  }

  // Pause button click
  if (pauseBtn) {
    pauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleUserPause();
    });
  }

  // Interactive Space Items (Click or keyboard to jump to that visual!)
  spaceItems.forEach(item => {
    const handleActivate = () => {
      const targetIdx = parseInt(item.dataset.venueTarget, 10);
      if (!isNaN(targetIdx)) {
        goToSlide(targetIdx);
        if (!isUserPaused) {
          restartAutoTimer();
        }
      }
    };

    item.addEventListener('click', handleActivate);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleActivate();
      }
    });
  });

  // Keyboard navigation on gallery
  gallery.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSlide(currentIndex - 1);
      if (!isUserPaused) restartAutoTimer();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToSlide(currentIndex + 1);
      if (!isUserPaused) restartAutoTimer();
    } else if ((e.key === ' ' || e.key === 'k' || e.key === 'K') && e.target === gallery) {
      e.preventDefault();
      toggleUserPause();
    }
  });

  // Touch Swipe Handling
  let touchStartX = 0;
  let touchStartY = 0;

  gallery.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      stopAutoTimer();
    }
  }, { passive: true });

  gallery.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = e.changedTouches[0].clientY - touchStartY;

      // Ensure horizontal swipe is dominant and exceeds threshold
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
        if (diffX < 0) {
          goToSlide(currentIndex + 1); // Swipe left = next
        } else {
          goToSlide(currentIndex - 1); // Swipe right = prev
        }
      }
      if (!isUserPaused) {
        restartAutoTimer();
      }
    }
  }, { passive: true });

  let isSectionInView = false;

  // Auto-advance Timer (only runs when venue section is in view, and not hovered/paused)
  function startAutoTimer() {
    stopAutoTimer();
    if (isUserPaused || !isSectionInView || isHoveredOrFocused) return;

    autoTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, AUTO_INTERVAL_MS);
  }

  function stopAutoTimer() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function restartAutoTimer() {
    stopAutoTimer();
    if (!isUserPaused && isSectionInView) {
      startAutoTimer();
    }
  }

  // Hover and focus listeners (only for devices with fine pointer / hover capability)
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    mediaStage.addEventListener('mouseenter', () => {
      isHoveredOrFocused = true;
      if (!isUserPaused) stopAutoTimer();
    });

    mediaStage.addEventListener('mouseleave', () => {
      isHoveredOrFocused = false;
      if (!isUserPaused && isSectionInView) startAutoTimer();
    });
  }

  mediaStage.addEventListener('focusin', () => {
    isHoveredOrFocused = true;
    if (!isUserPaused) stopAutoTimer();
  });

  mediaStage.addEventListener('focusout', (e) => {
    if (!mediaStage.contains(e.relatedTarget)) {
      isHoveredOrFocused = false;
      if (!isUserPaused && isSectionInView) startAutoTimer();
    }
  });

  // Check prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    isUserPaused = true;
  }

  // Viewport visibility observer: activate timer only while looking at the venue section
  if ('IntersectionObserver' in window) {
    const venueObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      isSectionInView = !!(entry && entry.isIntersecting);
      if (isSectionInView) {
        startAutoTimer();
      } else {
        stopAutoTimer();
      }
    }, { threshold: 0.1 });
    venueObserver.observe(mediaStage);
  } else {
    isSectionInView = true;
    startAutoTimer();
  }
  updatePauseButtonUI();

  // Initialize first slide state
  goToSlide(0);
}
