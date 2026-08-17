/**
 * MONUMENTA GRANITE & MEMORIALS - MAIN JAVASCRIPT
 * Handles mobile drawer, live headstone customizer, catalog filter,
 * testimonials carousel, quote form validation & interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. DYNAMIC CURRENT YEAR
  // ---------------------------------------------------------------------------
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ---------------------------------------------------------------------------
  // 2. MOBILE DRAWER NAVIGATION
  // ---------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileClose = document.getElementById('mobileClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileDrawer || !mobileBackdrop) return;
    mobileDrawer.classList.add('open');
    mobileBackdrop.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileBackdrop.setAttribute('aria-hidden', 'false');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileDrawer || !mobileBackdrop) return;
    mobileDrawer.classList.remove('open');
    mobileBackdrop.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileBackdrop.setAttribute('aria-hidden', 'true');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openMobileMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close drawer when clicking any link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  const mobileQuoteBtn = document.querySelector('.mobile-quote-btn');
  if (mobileQuoteBtn) {
    mobileQuoteBtn.addEventListener('click', closeMobileMenu);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ---------------------------------------------------------------------------
  // 3. HEADER SCROLL EFFECT & SCROLLSPY & BACK TO TOP
  // ---------------------------------------------------------------------------
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id], main > div[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header shadow on scroll
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }

    // Scrollspy active nav highlighting
    let currentSectionId = '';
    const headerOffset = 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerOffset;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && currentSectionId && href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------------------------------------------------------------------------
  // 4. CATALOG CATEGORY FILTERING
  // ---------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.catalog-filters .filter-btn');
  const productCards = document.querySelectorAll('.products-grid .product-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');

      // Update active button state
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Filter products
      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'All Memorials' || cardCategory === category) {
          card.classList.remove('hidden');
          // Smooth fade in
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 5. LIVE INSCRIPTION PREVIEWER / CUSTOM DESIGNER
  // ---------------------------------------------------------------------------
  const ipName = document.getElementById('ipName');
  const ipBorn = document.getElementById('ipBorn');
  const ipPassed = document.getElementById('ipPassed');
  const ipEpitaph = document.getElementById('ipEpitaph');

  const previewName = document.getElementById('previewName');
  const previewBorn = document.getElementById('previewBorn');
  const previewPassed = document.getElementById('previewPassed');
  const previewEpitaph = document.getElementById('previewEpitaph');
  const previewStage = document.getElementById('previewStage');
  const previewStoneLabel = document.getElementById('previewStoneLabel');
  const selectedStoneText = document.getElementById('selectedStoneText');

  const fontButtons = document.querySelectorAll('.font-btn');
  const stoneSwatches = document.querySelectorAll('.stone-swatch');
  const btnApplyQuote = document.getElementById('btnApplyQuote');

  const stoneBackgrounds = {
    black: {
      bg: 'linear-gradient(160deg, #24282e, #090b0d)',
      name: 'Rustenburg Black Granite',
    },
    red: {
      bg: 'linear-gradient(160deg, #5c2b23, #220d09)',
      name: 'African Red Granite',
    },
    galaxy: {
      bg: 'radial-gradient(circle at 30% 25%, #4a515c 0 2%, transparent 3%), radial-gradient(circle at 70% 65%, #4a515c 0 2%, transparent 3%), linear-gradient(160deg, #161a20, #040608)',
      name: 'Star Galaxy Granite',
    },
    olive: {
      bg: 'linear-gradient(160deg, #303b2d, #101611)',
      name: 'Olive Green Granite',
    },
  };

  const fontStyles = {
    serif: "'Playfair Display', Georgia, serif",
    script: "'Great Vibes', 'Playfair Display', cursive",
    roman: "'Cormorant Garamond', Georgia, serif",
  };

  let currentSelectedStone = 'Rustenburg Black';
  let currentSelectedFont = 'Classic Serif';

  // Real-time Text Bindings
  if (ipName && previewName) {
    ipName.addEventListener('input', () => {
      previewName.textContent = ipName.value.trim() || 'Full Name';
    });
  }

  if (ipBorn && previewBorn) {
    ipBorn.addEventListener('input', () => {
      previewBorn.textContent = ipBorn.value.trim() || 'Born';
    });
  }

  if (ipPassed && previewPassed) {
    ipPassed.addEventListener('input', () => {
      previewPassed.textContent = ipPassed.value.trim() || 'Passed';
    });
  }

  if (ipEpitaph && previewEpitaph) {
    ipEpitaph.addEventListener('input', () => {
      previewEpitaph.textContent = ipEpitaph.value.trim() || 'Memorial message';
    });
  }

  // Font Selection
  fontButtons.forEach(button => {
    button.addEventListener('click', () => {
      fontButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const fontKey = button.getAttribute('data-font');
      currentSelectedFont = button.textContent.trim();

      if (fontStyles[fontKey]) {
        if (previewName) previewName.style.fontFamily = fontStyles[fontKey];
        if (previewEpitaph) previewEpitaph.style.fontFamily = fontStyles[fontKey];

        // Adjust font sizing for cursive script font
        if (fontKey === 'script') {
          if (previewName) previewName.style.fontSize = 'clamp(1.4rem, 2.5vw, 1.85rem)';
          if (previewEpitaph) previewEpitaph.style.fontSize = '1.25rem';
        } else {
          if (previewName) previewName.style.fontSize = '';
          if (previewEpitaph) previewEpitaph.style.fontSize = '';
        }
      }
    });
  });

  // Stone Color Selection
  stoneSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      stoneSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const stoneKey = swatch.getAttribute('data-stone');
      const stoneConfig = stoneBackgrounds[stoneKey];

      if (stoneConfig && previewStage) {
        previewStage.style.background = stoneConfig.bg;
        currentSelectedStone = stoneConfig.name;
        if (previewStoneLabel) previewStoneLabel.textContent = stoneConfig.name;
        if (selectedStoneText) selectedStoneText.innerHTML = `Selected: <strong>${stoneConfig.name}</strong>`;
      }
    });
  });

  // "View & Customize" buttons on product cards
  const customizeButtons = document.querySelectorAll('.btn-customize');
  customizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const stoneKey = btn.getAttribute('data-stone') || 'black';
      const productName = btn.getAttribute('data-name') || '';

      // Activate corresponding stone swatch
      const targetSwatch = document.querySelector(`.stone-swatch[data-stone="${stoneKey}"]`);
      if (targetSwatch) {
        targetSwatch.click();
      }

      // Pre-fill category in quote form
      const formCategory = document.getElementById('formCategory');
      const parentCard = btn.closest('.product-card');
      if (formCategory && parentCard) {
        const cat = parentCard.getAttribute('data-category');
        if (cat) formCategory.value = cat;
      }

      // Smooth scroll to designer
      const designerSection = document.getElementById('designer');
      if (designerSection) {
        designerSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Apply to Quote Request Form
  if (btnApplyQuote) {
    btnApplyQuote.addEventListener('click', () => {
      const formInscription = document.getElementById('formInscription');
      const formCategory = document.getElementById('formCategory');

      const nameVal = ipName ? ipName.value.trim() : '';
      const bornVal = ipBorn ? ipBorn.value.trim() : '';
      const passedVal = ipPassed ? ipPassed.value.trim() : '';
      const epitaphVal = ipEpitaph ? ipEpitaph.value.trim() : '';

      const summary = `CUSTOM DESIGN DETAILS:\n` +
        `• Name: ${nameVal || 'N/A'}\n` +
        `• Dates: ${bornVal} — ${passedVal}\n` +
        `• Message: ${epitaphVal}\n` +
        `• Granite Stone: ${currentSelectedStone}\n` +
        `• Inscription Font: ${currentSelectedFont}`;

      if (formInscription) {
        formInscription.value = summary;
      }

      // Smooth scroll to contact quote form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Pulse highlight form
        const form = document.getElementById('quoteForm');
        if (form) {
          form.style.boxShadow = '0 0 0 2px var(--gold)';
          form.style.borderRadius = 'var(--radius-md)';
          form.style.transition = 'box-shadow 0.5s ease';
          setTimeout(() => {
            form.style.boxShadow = '';
          }, 1800);
        }
      }

      showToast('Customization Applied', 'Your custom tombstone specifications have been transferred to the quote form below.');
    });
  }

  // ---------------------------------------------------------------------------
  // 6. MEMORIAL TRIBUTES REVIEW CAROUSEL
  // ---------------------------------------------------------------------------
  const reviewSlides = document.querySelectorAll('.review-slide');
  const reviewDots = document.querySelectorAll('.review-dot');
  let currentReviewIndex = 0;
  let reviewInterval = null;

  function showReview(index) {
    reviewSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    reviewDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    currentReviewIndex = index;
  }

  function nextReview() {
    const nextIndex = (currentReviewIndex + 1) % reviewSlides.length;
    showReview(nextIndex);
  }

  function startReviewAutoPlay() {
    if (reviewInterval) clearInterval(reviewInterval);
    reviewInterval = setInterval(nextReview, 6000);
  }

  function stopReviewAutoPlay() {
    if (reviewInterval) clearInterval(reviewInterval);
  }

  reviewDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showReview(i);
      startReviewAutoPlay();
    });
  });

  const reviewsSlider = document.getElementById('reviewsSlider');
  if (reviewsSlider) {
    reviewsSlider.addEventListener('mouseenter', stopReviewAutoPlay);
    reviewsSlider.addEventListener('mouseleave', startReviewAutoPlay);

    // Touch Swipe Gestures for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    reviewsSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopReviewAutoPlay();
    }, { passive: true });

    reviewsSlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          // Swipe left (next)
          nextReview();
        } else {
          // Swipe right (prev)
          const prevIndex = (currentReviewIndex - 1 + reviewSlides.length) % reviewSlides.length;
          showReview(prevIndex);
        }
      }
      startReviewAutoPlay();
    }, { passive: true });
  }

  startReviewAutoPlay();

  // ---------------------------------------------------------------------------
  // 7. FILE UPLOAD PREVIEW
  // ---------------------------------------------------------------------------
  const formFile = document.getElementById('formFile');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const fileUploadBox = document.getElementById('fileUploadBox');

  if (formFile && fileNameDisplay) {
    formFile.addEventListener('change', () => {
      if (formFile.files && formFile.files[0]) {
        const file = formFile.files[0];
        fileNameDisplay.textContent = `Attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      } else {
        fileNameDisplay.textContent = '';
      }
    });

    // Drag & Drop visual feedback
    if (fileUploadBox) {
      ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadBox.addEventListener(eventName, (e) => {
          e.preventDefault();
          fileUploadBox.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        fileUploadBox.addEventListener(eventName, (e) => {
          e.preventDefault();
          fileUploadBox.classList.remove('dragover');
        });
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 8. QUOTE REQUEST FORM SUBMISSION & VALIDATION
  // ---------------------------------------------------------------------------
  const quoteForm = document.getElementById('quoteForm');
  const formName = document.getElementById('formName');
  const formPhone = document.getElementById('formPhone');
  const btnSubmitQuote = document.getElementById('btnSubmitQuote');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Full Name
      const nameGroup = formName ? formName.closest('.form-group') : null;
      if (formName && formName.value.trim().length < 2) {
        if (nameGroup) nameGroup.classList.add('has-error');
        isValid = false;
      } else if (nameGroup) {
        nameGroup.classList.remove('has-error');
      }

      // Validate Phone
      const phoneGroup = formPhone ? formPhone.closest('.form-group') : null;
      const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
      if (formPhone && !phoneRegex.test(formPhone.value.trim())) {
        if (phoneGroup) phoneGroup.classList.add('has-error');
        isValid = false;
      } else if (phoneGroup) {
        phoneGroup.classList.remove('has-error');
      }

      if (!isValid) return;

      // Button loading state
      if (btnSubmitQuote) {
        const originalContent = btnSubmitQuote.innerHTML;
        btnSubmitQuote.disabled = true;
        btnSubmitQuote.innerHTML = `
          <svg class="icon spin" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; margin-right: 8px;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          Processing Request...
        `;

        setTimeout(() => {
          btnSubmitQuote.disabled = false;
          btnSubmitQuote.innerHTML = originalContent;

          // Success notification
          showToast(
            'Quote Request Submitted!',
            `Thank you, ${formName.value.trim()}. A memorial consultant will contact you via WhatsApp/Phone within 1 working day.`
          );

          // Reset form
          quoteForm.reset();
          if (fileNameDisplay) fileNameDisplay.textContent = '';
        }, 1200);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 9. TOAST NOTIFICATION UTILITY
  // ---------------------------------------------------------------------------
  const toastNotification = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  const toastClose = document.getElementById('toastClose');
  let toastTimer = null;

  function showToast(title, message) {
    if (!toastNotification) return;

    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;

    toastNotification.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 6000);
  }

  if (toastClose) {
    toastClose.addEventListener('click', () => {
      if (toastNotification) toastNotification.classList.remove('show');
      if (toastTimer) clearTimeout(toastTimer);
    });
  }

  // Add CSS keyframe for spinner dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

});
