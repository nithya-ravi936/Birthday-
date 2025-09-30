// Initialize particles on page load
document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    initializeAnimations();
    setupScrollAnimations();
});

// Create floating particles
function createParticles() {
    const particles = document.getElementById('particles');
    const particleEmojis = ['❤️', '💕', '💖', '💗', '🌸', '🌺', '✨', '💫', '🦋'];

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];

        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Random animation duration and delay
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';

        particles.appendChild(particle);
    }
}

// Initialize typewriter and other animations
function initializeAnimations() {
    // Typewriter effect is handled by CSS

    // Add staggered animation delays to elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        element.style.animationDelay = (index * 0.2) + 's';
    });
}

// Scroll animations (AOS - Animate On Scroll)
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');

                // Special handling for message text
                if (entry.target.classList.contains('message-card')) {
                    animateMessageText();
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const elementsToObserve = document.querySelectorAll('[data-aos], .section-title, .message-card');
    elementsToObserve.forEach(element => {
        observer.observe(element);

        // Add delay based on data-delay attribute
        const delay = element.getAttribute('data-delay');
        if (delay) {
            element.style.transitionDelay = delay + 'ms';
        }
    });
}

// Animate message text with staggered effect
function animateMessageText() {
    const messageTexts = document.querySelectorAll('.message-text');
    messageTexts.forEach((text, index) => {
        setTimeout(() => {
            text.classList.add('fade-in-animate');
        }, index * 500);
    });
}

// Smooth scroll to sections
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Toggle like functionality for photos
function toggleLike(button) {
    const heartIcon = button.querySelector('.heart-icon');
    button.classList.toggle('liked');

    if (button.classList.contains('liked')) {
        heartIcon.textContent = '❤️';
        // Create floating heart effect
        createFloatingHeart(button);
    } else {
        heartIcon.textContent = '🤍';
    }
}

// Create floating heart animation when photo is liked
function createFloatingHeart(button) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.fontSize = '1.5rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';

    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + 'px';
    heart.style.top = rect.top + 'px';

    document.body.appendChild(heart);

    // Animate the heart
    heart.animate([
        { transform: 'translateY(0px) scale(1)', opacity: 1 },
        { transform: 'translateY(-60px) scale(1.5)', opacity: 0 }
    ], {
        duration: 1500,
        easing: 'ease-out'
    }).onfinish = () => {
        document.body.removeChild(heart);
    };
}

// Optimized scroll handler with RAF
let scrollScheduled = false;
window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector('.hero');
      const parallaxSpeed = 0.5;

      if (hero) {
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }

      // Update particles position based on scroll
      const particles = document.querySelectorAll('.particle');
      particles.forEach((particle, index) => {
        const speed = 0.2 + (index % 3) * 0.1;
        particle.style.transform = `translateY(${scrolled * speed}px)`;
      });

      scrollScheduled = false;
    });
    scrollScheduled = true;
  }
});

// Optimized mousemove handler with RAF
let mouseScheduled = false;
document.addEventListener('mousemove', (e) => {
  if (!mouseScheduled) {
    requestAnimationFrame(() => {
      const hero = document.querySelector('.hero');
      if (!hero) return;

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;

      const floatingHearts = document.querySelector('.floating-hearts');
      if (floatingHearts) {
        floatingHearts.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }

      mouseScheduled = false;
    });
    mouseScheduled = true;
  }
});

// Add click effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// detect touch / mobile (no hover) - define this ONCE in the file











// --- SPOTLIGHT LOGIC FOR MOBILE ---
const isTouchDevice =
  'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

function updateVisiblePhoto() {
  if (!isTouchDevice) return;

  const cards = document.querySelectorAll('.photo-card');
  if (!cards.length) return;

  const viewportCenter = window.innerHeight / 2;
  let closestCard = null;
  let closestDistance = Infinity;

  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.top + rect.height / 2;
    const distance = Math.abs(cardCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestCard = card;
    }
  });

  // Remove caption from all, then show only for the closest card
  cards.forEach(card => card.classList.remove('show-caption'));
  if (closestCard) {
    closestCard.classList.add('show-caption');
  }
}

if (isTouchDevice) {
  window.addEventListener('scroll', updateVisiblePhoto, { passive: true });
  window.addEventListener('resize', updateVisiblePhoto);
  window.addEventListener('load', updateVisiblePhoto);

  // When CTA clicked, run update after a small delay so smooth scroll settles
  document.querySelector('.cta-button')?.addEventListener('click', () => {
    setTimeout(updateVisiblePhoto, 450);
  });
}

// --- DESKTOP ANIMATION ONLY ---
const photoObserver = new IntersectionObserver((entries) => {
  if (!isTouchDevice) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector('img');
        if (img) {
          img.style.animation = 'photoEnter 0.8s ease-out forwards';
        }
      }
    });
  }
}, { threshold: 0.3 });

document.querySelectorAll('.photo-card').forEach(card => {
  photoObserver.observe(card);
});

// --- KEYFRAMES ---
const photoStyle = document.createElement('style');
photoStyle.textContent = `
    @keyframes photoEnter {
        from { transform: scale(0.8) rotate(-5deg); opacity: 0; }
        to   { transform: scale(1) rotate(0deg); opacity: 1; }
    }
`;
document.head.appendChild(photoStyle);
