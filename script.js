export function init() {
  // 1. Navbar Scroll Effect & Mobile Menu
  const navbar = document.getElementById('navbar');
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // 2. Scroll Animation Observer (Staggered Fade-Up)
  const animElements = document.querySelectorAll('.scroll-anim');
  const animObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  animElements.forEach(el => animObserver.observe(el));

  // 3. Stats Counter
  const counters = document.querySelectorAll('.counter');
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        
        let startTime = null;
        const duration = 2000;

        const animate = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const currentVal = Math.floor(progress * target);
          
          counter.innerText = currentVal + suffix;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            counter.innerText = target + suffix;
          }
        };
        requestAnimationFrame(animate);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => statObserver.observe(c));

  // 4. Cyber Countdown Timer
  const cyberCountdown = document.getElementById('cyberCountdown');
  if (cyberCountdown) {
    const ddElem = document.getElementById('cyberDd');
    const hhElem = document.getElementById('cyberHh');
    const mmElem = document.getElementById('cyberMm');
    const ssElem = document.getElementById('cyberSs');
    const statusElem = document.getElementById('cyberCountdownStatus');
    const deadlineRaw = cyberCountdown.getAttribute('data-deadline');
    const deadline = deadlineRaw ? new Date(deadlineRaw).getTime() : null;

    if (ddElem && hhElem && mmElem && ssElem && deadline) {
      const pad = (value) => String(value).padStart(2, '0');

      const writeCountdown = (distance) => {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((distance % (1000 * 60)) / 1000);

        ddElem.innerText = pad(days);
        hhElem.innerText = pad(hours);
        mmElem.innerText = pad(mins);
        ssElem.innerText = pad(secs);
      };

      let timer = null;

      const tick = () => {
        const now = Date.now();
        const distance = deadline - now;

        if (distance <= 0) {
          writeCountdown(0);
          if (statusElem) statusElem.innerText = 'Cyber finalizado';
          if (timer) clearInterval(timer);
          return;
        }

        writeCountdown(distance);
      };

      tick();
      timer = setInterval(tick, 1000);
    }
  }

  // 4.5. Services Carousel (Mobile)
  const servicesGrid = document.getElementById('servicesGrid');
  const servicesDots = document.querySelectorAll('.mc-dot');
  
  if (servicesGrid && servicesDots.length > 0) {
    let isAutoScrolling = true;
    let autoScrollInterval;

    const updateDots = () => {
      const scrollLeft = servicesGrid.scrollLeft;
      const width = servicesGrid.offsetWidth;
      const children = Array.from(servicesGrid.querySelectorAll('.service-item'));
      
      let closestIndex = 0;
      let minDiff = Infinity;
      const gridCenter = scrollLeft + width / 2;
      
      children.forEach((child, i) => {
        // Position relative to the grid
        const childCenter = (child.offsetLeft - servicesGrid.offsetLeft) + child.offsetWidth / 2;
        const diff = Math.abs(gridCenter - childCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      });

      servicesDots.forEach((d, i) => {
        d.classList.toggle('active', i === closestIndex);
      });
      return closestIndex;
    };

    // Use a debounced or throttled scroll listener for performance if needed, 
    // but for dots, simple listener is usually fine.
    servicesGrid.addEventListener('scroll', updateDots);

    const scrollToService = (index) => {
      const children = Array.from(servicesGrid.querySelectorAll('.service-item'));
      const child = children[index];
      if (child) {
        const targetLeft = (child.offsetLeft - servicesGrid.offsetLeft) - (servicesGrid.offsetWidth - child.offsetWidth) / 2;
        servicesGrid.scrollTo({
          left: targetLeft,
          behavior: 'smooth'
        });
      }
    };

    const startAutoScroll = () => {
      stopAutoScroll(); // Clear existing
      autoScrollInterval = setInterval(() => {
        if (!isAutoScrolling) return;
        const currentIndex = updateDots();
        const nextIndex = (currentIndex + 1) % servicesDots.length;
        scrollToService(nextIndex);
      }, 5000);
    };

    const stopAutoScroll = () => {
      clearInterval(autoScrollInterval);
    };

    // Pause auto-scroll on interaction
    servicesGrid.addEventListener('touchstart', () => { 
      isAutoScrolling = false; 
      stopAutoScroll(); 
    }, {passive: true});

    // Dot click listener
    servicesDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        isAutoScrolling = false;
        stopAutoScroll();
        const index = parseInt(e.target.getAttribute('data-index'));
        scrollToService(index);
      });
    });

    // Initialize auto-scroll
    if (window.innerWidth <= 768) {
      startAutoScroll();
    }
  }

  // 5. Real Gallery Carousel
  const galleryTrack = document.getElementById('galleryTrack');
  const gallerySlides = Array.from(galleryTrack ? galleryTrack.children : []);
  const galleryNextBtn = document.querySelector('.gallery-arrow.next');
  const galleryPrevBtn = document.querySelector('.gallery-arrow.prev');
  const galleryDots = Array.from(document.querySelectorAll('#galleryDots .gallery-dot'));
  const galleryWrap = document.querySelector('.real-gallery-track-wrap');

  if (galleryTrack && gallerySlides.length > 0) {
    let currentGallerySlide = 0;
    let galleryAutoInterval = null;
    const canAutoRotateGallery = () => window.matchMedia('(min-width: 768px)').matches;

    const moveGalleryTo = (index) => {
      galleryTrack.style.transform = `translateX(-${index * 100}%)`;
      currentGallerySlide = index;
      galleryDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
      });
    };

    const galleryNext = () => {
      const next = currentGallerySlide === gallerySlides.length - 1 ? 0 : currentGallerySlide + 1;
      moveGalleryTo(next);
    };

    const galleryPrev = () => {
      const prev = currentGallerySlide === 0 ? gallerySlides.length - 1 : currentGallerySlide - 1;
      moveGalleryTo(prev);
    };

    const stopGalleryAuto = () => {
      if (galleryAutoInterval) {
        clearInterval(galleryAutoInterval);
        galleryAutoInterval = null;
      }
    };

    const startGalleryAuto = () => {
      if (galleryAutoInterval || !canAutoRotateGallery()) return;
      galleryAutoInterval = setInterval(galleryNext, 3800);
    };

    moveGalleryTo(0);
    if (galleryNextBtn) galleryNextBtn.addEventListener('click', galleryNext);
    if (galleryPrevBtn) galleryPrevBtn.addEventListener('click', galleryPrev);

    galleryDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const index = Number(e.currentTarget.getAttribute('data-index'));
        if (!Number.isNaN(index)) {
          moveGalleryTo(index);
        }
      });
    });

    if (galleryWrap) {
      galleryWrap.addEventListener('mouseenter', stopGalleryAuto);
      galleryWrap.addEventListener('mouseleave', startGalleryAuto);
      galleryWrap.addEventListener('touchstart', stopGalleryAuto, { passive: true });
    }

    startGalleryAuto();
    window.addEventListener('resize', () => {
      if (canAutoRotateGallery()) startGalleryAuto();
      else stopGalleryAuto();
    });
  }

  // 6. Testimonial Carousel
  const track = document.querySelector('.car-track');
  const slides = Array.from(track ? track.children : []);
  const nextBtn = document.querySelector('.car-arrow.next');
  const prevBtn = document.querySelector('.car-arrow.prev');
  
  if (track && slides.length > 0) {
    let currentSlide = 0;
    
    const moveToSlide = (index) => {
      track.style.transform = `translateX(-${index * 100}%)`;
      currentSlide = index;
    };
    
    const nextFn = () => {
      const target = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
      moveToSlide(target);
    };
    
    const prevFn = () => {
      const target = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
      moveToSlide(target);
    };
    
    if (nextBtn) nextBtn.addEventListener('click', nextFn);
    if (prevBtn) prevBtn.addEventListener('click', prevFn);
    
    setInterval(nextFn, 4000);
  }

  // 7. Before & After Slider
  const baContainer = document.getElementById('baContainer');
  if (baContainer) {
    const dragText = document.getElementById('baDragText');
    let interacted = false;

    const handleSlider = (e) => {
      if (!interacted) {
        interacted = true;
        if (dragText) dragText.style.opacity = '0';
      }
      const rect = baContainer.getBoundingClientRect();
      let x = e.clientX || (e.touches && e.touches[0].clientX);
      if (x === undefined) return;
      let pos = ((x - rect.left) / rect.width) * 100;
      pos = Math.max(0, Math.min(100, pos));
      baContainer.style.setProperty('--pos', pos + '%');
    };

    let isDragging = false;
    baContainer.addEventListener('mousedown', (e) => { isDragging = true; handleSlider(e); });
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => { if (isDragging) handleSlider(e); });

    baContainer.addEventListener('touchstart', (e) => { isDragging = true; handleSlider(e); }, {passive: true});
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => { if (isDragging) handleSlider(e); }, {passive: true});

    // Auto-animation on scroll
    let animationDone = false;
    const baObserver = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting && !animationDone && !interacted) {
        animationDone = true;
        let frame = 0;
        const frames = 90; // 1.5 seconds duration
        function animate() {
          if (interacted || isDragging) return;
          frame++;
          const progress = frame / frames;
          const offset = Math.sin(progress * Math.PI) * 20; // Swing 20% left
          baContainer.style.setProperty('--pos', (50 - offset) + '%');
          
          if(frame < frames) {
            requestAnimationFrame(animate);
          } else {
            setTimeout(() => {
              if(!interacted && dragText) dragText.style.opacity = '0';
            }, 1000);
          }
        }
        setTimeout(() => requestAnimationFrame(animate), 500);
      }
    }, { threshold: 0.5 });
    baObserver.observe(baContainer);
  }

  // 8. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all
      faqItems.forEach(fi => {
        fi.classList.remove('active');
        fi.querySelector('.faq-a').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  // 9. Gallery Lightbox
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryLinks = document.querySelectorAll('[data-lightbox]');

  if (lightbox && lightboxImg && lightboxCaption && lightboxClose && galleryLinks.length > 0) {
    const openLightbox = (href, caption) => {
      lightboxImg.src = href;
      lightboxCaption.textContent = caption || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.removeAttribute('src');
      document.body.style.overflow = '';
    };

    galleryLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const caption = link.getAttribute('data-caption');
        if (href) openLightbox(href, caption);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  // 10. Floating WhatsApp Button Delay
  const waContainer = document.getElementById('waFloat');
  if (waContainer) {
    setTimeout(() => {
      waContainer.classList.add('show');
    }, 2000);
  }
}

// Ensure execution when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
