(function () {
  'use strict';

  // Splash: play first 2.5s of motion graphic, then fade out (timer starts when video actually plays)
  (function () {
    var splash = document.getElementById('splash');
    var video = splash && splash.querySelector('.splash-video');
    var splashDurationMs = 3000;
    var fadeDurationMs = 600;
    var timeoutId = null;

    if (!splash || !video) return;

    function startFadeOut() {
      if (timeoutId) return;
      timeoutId = window.setTimeout(function () {
        splash.classList.add('is-hidden');
        splash.setAttribute('aria-hidden', 'true');
        window.setTimeout(function () {
          splash.classList.add('is-removed');
          video.pause();
        }, fadeDurationMs);
      }, splashDurationMs);
    }

    video.addEventListener('playing', startFadeOut, { once: true });
    video.play().catch(function () {
      startFadeOut();
    });
  })();





  // Signup: injected at build from env SIGNUP_ENDPOINT / SIGNUP_SECRET
  var SIGNUP_ENDPOINT = '__SIGNUP_ENDPOINT__';
  var SIGNUP_SECRET = '__SIGNUP_SECRET__';




  
  // Year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Photo gallery: smooth auto-advance + dot controls
  (function () {
    var gallery = document.querySelector('.photo-gallery');
    if (!gallery) return;
    var slides = gallery.querySelectorAll('.photo-gallery-slide');
    var dots = gallery.querySelectorAll('.photo-gallery-dot');
    var current = 0;
    var total = slides.length;
    var advanceMs = 6000;
    var timer = null;

    function goTo(index) {
      current = (index + total) % total;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }

    function next() {
      goTo(current + 1);
    }

    function startTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, advanceMs);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        startTimer();
      });
    });
    startTimer();
  })();

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Signup forms (main + nav)
  function handleSignupSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var input = form.querySelector('input[type="email"]');
    var messageEl = form.querySelector('.signup-message');
    var submitBtn = form.querySelector('button[type="submit"]');
    var email = (input && input.value && input.value.trim()) || '';
    if (!email || !messageEl || !submitBtn) return;

    messageEl.hidden = true;
    messageEl.textContent = '';
    messageEl.classList.remove('success', 'error', 'fade-out');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing…';

    fetch(SIGNUP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ email: email.trim(), token: SIGNUP_SECRET })
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (_ref) {
        var ok = _ref.ok;
        var data = _ref.data;
        messageEl.hidden = false;
        if (ok && data && data.ok !== false) {
          messageEl.textContent = "You're on the list!";
          messageEl.classList.add('success');
          if (input) input.value = '';
          window.setTimeout(function () {
            messageEl.classList.add('fade-out');
            window.setTimeout(function () {
              messageEl.hidden = true;
              messageEl.textContent = '';
              messageEl.classList.remove('success', 'fade-out');
            }, 1500);
          }, 3000);
        } else {
          messageEl.textContent = (data && data.error) || 'Something went wrong. Try again.';
          messageEl.classList.add('error');
        }
      })
      .catch(function () {
        messageEl.hidden = false;
        messageEl.textContent = 'Something went wrong. Try again.';
        messageEl.classList.add('error');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe';
      });
  }

  var signupForms = document.querySelectorAll('.signup-form');
  signupForms.forEach(function (form) {
    form.addEventListener('submit', handleSignupSubmit);
  });
})();
