// Modern Portfolio JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Universal animation system - observe all elements with animate-card class
  document.querySelectorAll('.animate-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add hover effect to navigation links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Parallax effect for hero section
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.3}px)`;
      hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
  });

  // Add ripple effect to buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add active class to current page nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Typing effect for hero tagline (optional enhancement)
  const tagline = document.querySelector('.hero-tagline');
  if (tagline && !sessionStorage.getItem('taglineAnimated')) {
    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.opacity = '1';

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        tagline.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        sessionStorage.setItem('taglineAnimated', 'true');
      }
    };

    setTimeout(typeWriter, 1000);
  }
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
  .btn {
    position: relative;
    overflow: hidden;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @media (max-width: 768px) {
    .nav-links {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(15, 15, 30, 0.98);
      flex-direction: column;
      padding: 1rem;
      gap: 0;
      box-shadow: 0 8px 32px rgba(184, 164, 212, 0.2);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .nav-links.active {
      max-height: 400px;
    }

    .nav-links li {
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .nav-links.active li {
      opacity: 1;
      transform: translateY(0);
    }

    .nav-links.active li:nth-child(1) { transition-delay: 0.1s; }
    .nav-links.active li:nth-child(2) { transition-delay: 0.15s; }
    .nav-links.active li:nth-child(3) { transition-delay: 0.2s; }
    .nav-links.active li:nth-child(4) { transition-delay: 0.25s; }
    .nav-links.active li:nth-child(5) { transition-delay: 0.3s; }
    .nav-links.active li:nth-child(6) { transition-delay: 0.35s; }

    .nav-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .nav-toggle.active span:nth-child(2) {
      opacity: 0;
    }

    .nav-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  }
`;
document.head.appendChild(style);

// Carousel Slideshow System
class Carousel {
  constructor(carouselElement) {
    this.carousel = carouselElement;
    this.slides = carouselElement.querySelectorAll('.carousel-slide');
    this.indicators = carouselElement.querySelectorAll('.indicator');
    this.currentSlide = 0;
    this.intervalId = null;
    this.isPaused = false;

    this.init();
  }

  init() {
    // Set up indicator click handlers
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', (e) => {
        e.stopPropagation();
        this.goToSlide(index);
      });
    });

    // Pause on hover
    this.carousel.addEventListener('mouseenter', () => {
      this.pause();
    });

    this.carousel.addEventListener('mouseleave', () => {
      this.resume();
    });

    // Start auto-advance
    this.start();
  }

  goToSlide(index) {
    // Remove active class from current slide and indicator
    this.slides[this.currentSlide].classList.remove('active');
    this.indicators[this.currentSlide].classList.remove('active');

    // Add active class to new slide and indicator
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add('active');
    this.indicators[this.currentSlide].classList.add('active');
  }

  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(next);
  }

  start() {
    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, 4500); // 4.5 seconds per slide
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

// Lightbox Modal System
class Lightbox {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    // Create modal HTML
    this.modal = document.createElement('div');
    this.modal.className = 'lightbox-modal';
    this.modal.innerHTML = `
      <div class="lightbox-content">
        <span class="lightbox-close">&times;</span>
        <img src="" alt="Full size image" class="lightbox-image">
      </div>
    `;
    document.body.appendChild(this.modal);

    // Close handlers
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    this.modal.querySelector('.lightbox-close').addEventListener('click', () => {
      this.close();
    });

    // ESC key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(imageSrc) {
    const img = this.modal.querySelector('.lightbox-image');
    img.src = imageSrc;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  }
}

// Initialize carousels and lightbox
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all carousels
  const carousels = document.querySelectorAll('.interest-carousel');
  const carouselInstances = [];

  carousels.forEach(carousel => {
    carouselInstances.push(new Carousel(carousel));
  });

  // Initialize lightbox
  const lightbox = new Lightbox();

  // Add click handlers to all carousel images
  document.querySelectorAll('.carousel-slide').forEach(slide => {
    slide.addEventListener('click', () => {
      lightbox.open(slide.src);
    });
  });
});
