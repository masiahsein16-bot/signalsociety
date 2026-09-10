/* ========================================
   SIGNAL SOCIETY — Main Script v5
   ======================================== */

// Nuclear fallback
setTimeout(() => { document.getElementById('pageLoader')?.remove(); document.getElementById('shutter')?.remove(); }, 3500);
window.addEventListener('error', () => { document.getElementById('pageLoader')?.remove(); document.getElementById('shutter')?.remove(); });

// Supabase
const SUPABASE_URL = 'https://iemdkhpvatoewujqlbbh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbWRraHB2YXRvZXd1anFsYmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDE2MjUsImV4cCI6MjEwMzQ3NzYyNX0.EIzkjs9Md72aKzowpIHiLKj7eR7rxbv4noNS_fzzoBE';
let supabase = null;
try { if (window.supabase) supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); } catch (e) { console.warn('Supabase init failed:', e); }

// Cursor Glow
const cursorGlow = document.getElementById('cursorGlow');
if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow && !cursorGlow.classList.contains('active')) cursorGlow.classList.add('active');
        requestAnimationFrame(() => { if (cursorGlow) { cursorGlow.style.left = e.clientX + 'px'; cursorGlow.style.top = e.clientY + 'px'; } });
    });
    document.addEventListener('mouseleave', () => { if (cursorGlow) cursorGlow.classList.remove('active'); });
}

// Telemetry
const telemetry = document.getElementById('telemetry');
if (telemetry) {
    const spans = telemetry.querySelectorAll('.mono-label');
    function updateTelemetry() {
        const scrollPct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (spans[0]) spans[0].textContent = `SCRL ${String(scrollPct).padStart(3, '0')}%`;
        if (spans[1]) spans[1].textContent = `X ${String(Math.round(window.scrollX)).padStart(4, '0')} · Y ${String(Math.round(window.scrollY)).padStart(4, '0')}`;
        const now = new Date();
        if (spans[2]) spans[2].textContent = `ID ${now.toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour12: false })}`;
    }
    window.addEventListener('scroll', updateTelemetry, { passive: true });
    updateTelemetry();
}

// Navigation
const siteHeader = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
window.addEventListener('scroll', () => { siteHeader.classList.toggle('site-header--scrolled', window.scrollY > 20); });
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileMenu.setAttribute('aria-hidden', !mobileMenu.classList.contains('active'));
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(link => {
    link.addEventListener('click', () => { navToggle.classList.remove('active'); mobileMenu.classList.remove('active'); mobileMenu.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) { e.preventDefault(); window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
    });
});

// Scroll Reveal with stagger
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.services__grid, .projects__grid, .faq__grid').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((item, i) => { item.style.transitionDelay = `${i * 0.08}s`; });
});

// FAQ Accordion
document.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
        btn.setAttribute('aria-expanded', !wasActive);
    });
});

// Contact Form → Email redirect
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const company = contactForm.company.value.trim();
        const service = contactForm.service.value;
        const message = contactForm.message.value.trim();
        const subject = encodeURIComponent(`Project Inquiry from ${name}${company ? ' — ' + company : ''}`);
        const body = encodeURIComponent(`Hi Signal Society,\n\nMy name is ${name}${company ? ' from ' + company : ''}.\n\nService interested in: ${service || 'Not specified'}\n\n${message}\n\nBest regards,\n${name}\n${email}`);
        window.location.href = `mailto:signalssoc@gmail.com?subject=${subject}&body=${body}`;
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn__text').textContent = 'Message sent ✓';
        formMessage.innerHTML = '<strong>Your message has been sent to signalssoc@gmail.com.</strong> Please wait — we\'ll get back to you by email shortly.';
        formMessage.classList.add('form__message--success');
        contactForm.reset();
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn__text').innerHTML = 'Send message <span class="arrow">→</span>';
        }, 5000);
    });
}

// Nav active link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.site-header__link');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => { if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id'); });
    navLinks.forEach(link => { link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--white)' : ''; });
});

// Magnetic buttons
if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn--solid, .btn--accent, .btn--line').forEach(btn => {
        btn.addEventListener('mousemove', (e) => { const rect = btn.getBoundingClientRect(); btn.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.15}px, ${(e.clientY - rect.top - rect.height / 2) * 0.15}px)`; });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}
