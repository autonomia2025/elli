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

  // 4. 24-Hour Countdown Timer
  const hhElem = document.getElementById('hh');
  const mmElem = document.getElementById('mm');
  const ssElem = document.getElementById('ss');
  
  if (hhElem && mmElem && ssElem) {
    // Start of next day
    const getNextMidnight = () => {
      const d = new Date();
      d.setHours(24, 0, 0, 0);
      return d.getTime();
    };
    
    const updateTime = () => {
      const now = new Date().getTime();
      const distance = getNextMidnight() - now;
      
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      
      hhElem.innerText = h.toString().padStart(2, '0');
      mmElem.innerText = m.toString().padStart(2, '0');
      ssElem.innerText = s.toString().padStart(2, '0');
    };
    
    updateTime();
    setInterval(updateTime, 1000);
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

  // 5. Testimonial Carousel
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

  // 6. Before & After Slider
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

  // 7. FAQ Accordion
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

  // 8. Floating WhatsApp Button Delay
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
