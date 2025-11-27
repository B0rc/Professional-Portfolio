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

// Lightbox Modal System with Image Navigation
class Lightbox {
  constructor() {
    this.modal = null;
    this.images = [];
    this.currentIndex = 0;
    this.init();
  }

  init() {
    // Create modal HTML with navigation arrows
    this.modal = document.createElement('div');
    this.modal.className = 'lightbox-modal';
    this.modal.innerHTML = `
      <div class="lightbox-content">
        <span class="lightbox-close">&times;</span>
        <button class="lightbox-prev" aria-label="Previous image">&lsaquo;</button>
        <img src="" alt="Full size image" class="lightbox-image">
        <button class="lightbox-next" aria-label="Next image">&rsaquo;</button>
        <div class="lightbox-counter"></div>
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

    // Navigation handlers
    this.modal.querySelector('.lightbox-prev').addEventListener('click', (e) => {
      e.stopPropagation();
      this.prev();
    });

    this.modal.querySelector('.lightbox-next').addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });

    // Keyboard handlers
    document.addEventListener('keydown', (e) => {
      if (this.modal.classList.contains('active')) {
        if (e.key === 'Escape') {
          this.close();
        } else if (e.key === 'ArrowLeft') {
          this.prev();
        } else if (e.key === 'ArrowRight') {
          this.next();
        }
      }
    });
  }

  open(images, startIndex = 0) {
    this.images = images;
    this.currentIndex = startIndex;
    this.showImage();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  showImage() {
    const img = this.modal.querySelector('.lightbox-image');
    const counter = this.modal.querySelector('.lightbox-counter');

    img.src = this.images[this.currentIndex];
    counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

    // Show/hide navigation buttons based on image count
    const prevBtn = this.modal.querySelector('.lightbox-prev');
    const nextBtn = this.modal.querySelector('.lightbox-next');

    if (this.images.length > 1) {
      prevBtn.style.display = 'block';
      nextBtn.style.display = 'block';
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.showImage();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.showImage();
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Initialize lightbox and card click handlers
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = new Lightbox();

  // Add click handlers to each interest card
  document.querySelectorAll('.interest-card').forEach(card => {
    const carousel = card.querySelector('.interest-carousel');
    if (carousel) {
      // Get all image sources from this card
      const slides = carousel.querySelectorAll('.carousel-slide');
      const imageSources = Array.from(slides).map(slide => slide.src);

      // Make the entire card clickable
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        lightbox.open(imageSources, 0);
      });
    }
  });
});
