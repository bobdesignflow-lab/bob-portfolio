/* ===== Robert Thuo Portfolio — Premium Interactions ===== */
(function () {
  'use strict';

  // --- Loader ---
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.getElementById('loader').classList.add('hidden');
      document.querySelectorAll('.reveal-up').forEach(function (el) {
        el.classList.add('visible');
      });
      animateCounters(document.querySelectorAll('.stat-num'));
    }, 600);
  });

  // --- Scroll progress bar ---
  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    document.getElementById('progress-bar').style.width = pct + '%';
  });

  // --- Navbar scroll effect ---
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Mobile menu ---
  var menuBtn = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // --- Intersection Observer for scroll animations ---
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate skill bars
        if (entry.target.classList.contains('skill-bar')) {
          var pct = entry.target.getAttribute('data-pct');
          var fill = entry.target.querySelector('.bar-fill');
          if (fill) {
            entry.target.style.setProperty('--pct', pct + '%');
          }
        }

        // Animate bento counters
        var nums = entry.target.querySelectorAll('.bento-num');
        if (nums.length > 0) {
          animateCounters(nums);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.anim-up, .skill-bar').forEach(function (el) {
    observer.observe(el);
  });

  // --- Counter animation ---
  function animateCounters(elements) {
    elements.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      var duration = 1500;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
