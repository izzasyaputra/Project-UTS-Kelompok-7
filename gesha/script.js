(function () {
    'use strict';

    // Enables reveal styles only when JavaScript is running
    document.documentElement.classList.add('js');

    // Dynamic year
    var yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile navigation
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('nav-links');

    function setMenu(open) {
        if (!toggle || !menu) return;
        menu.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    }

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            setMenu(toggle.getAttribute('aria-expanded') !== 'true');
        });
        menu.addEventListener('click', function (e) {
            if (e.target.closest('a')) setMenu(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setMenu(false);
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) setMenu(false);
        });
    }

    // Header border + active navigation state
    var header = document.querySelector('.site-header');
    var sections = Array.prototype.slice.call(document.querySelectorAll('main > section[id]'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
    var ticking = false;

    function setActive(id) {
        navLinks.forEach(function (link) {
            var isActive = link.getAttribute('href') === '#' + id;
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
    }

    function update() {
        ticking = false;
        if (header) header.classList.toggle('scrolled', window.scrollY > 8);
        if (!sections.length) return;

        var pos = window.scrollY + window.innerHeight * 0.35;
        var current = sections[0];
        sections.forEach(function (s) {
            if (s.getBoundingClientRect().top + window.scrollY <= pos) current = s;
        });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
            current = sections[sections.length - 1];
        }
        setActive(current.id);
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    // Scroll reveal
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }
})();