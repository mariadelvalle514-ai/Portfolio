// Portfolio interactions: scroll-reveal, parallax, hero fade
(function () {
  var motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io;

  function reveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]')).filter(function (el) { return !el.__rv; });
    if (!els.length) return;
    if (!motion) { els.forEach(function (el) { el.__rv = true; el.style.opacity = '1'; }); return; }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          var d = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () {
            el.style.opacity = '1';
            if (el.getAttribute('data-reveal') !== 'fade' && !el.hasAttribute('data-parallax')) el.style.transform = 'none';
          }, d);
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    }
    els.forEach(function (el) {
      el.__rv = true;
      var mode = el.getAttribute('data-reveal');
      el.style.opacity = '0';
      el.style.willChange = 'opacity, transform';
      el.style.transition = 'opacity 1400ms cubic-bezier(.22,.7,.2,1), transform 1400ms cubic-bezier(.22,.7,.2,1)';
      if (!el.hasAttribute('data-parallax')) {
        if (mode === 'up') el.style.transform = 'translateY(38px)';
        else if (mode === 'right') el.style.transform = 'translateX(52px) scale(1.03)';
        else if (mode === 'scale') el.style.transform = 'scale(0.94)';
      }
      io.observe(el);
    });
  }

  function scrollFx() {
    if (!motion) return;
    var amt = 0.6;
    var raf = null;
    function frame() {
      raf = null;
      var y = window.scrollY || 0;
      var vh = window.innerHeight;
      var hero = document.querySelector('[data-hero]');
      if (hero) {
        var p = Math.min(y / vh, 1.2);
        hero.style.transform = 'translateY(' + (p * 70 * amt).toFixed(2) + 'px) scale(' + (1 - p * 0.06 * amt).toFixed(4) + ')';
        hero.style.opacity = String(Math.max(0, 1 - p * 1.05));
      }
      var hint = document.querySelector('[data-scrollhint]');
      if (hint) hint.style.opacity = String(Math.max(0, 1 - y / (vh * 0.35)));
      document.querySelectorAll('[data-parallax]').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var rel = (r.top + r.height / 2 - vh / 2) / vh;
        var k = parseFloat(el.getAttribute('data-parallax')) || 0;
        el.style.transform = 'translate3d(0,' + (rel * k * 240 * amt).toFixed(2) + 'px,0)';
      });
    }
    window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(frame); }, { passive: true });
    frame();
  }

  document.addEventListener('DOMContentLoaded', function () { reveals(); scrollFx(); });
})();
