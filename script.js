/* ========================================
   SIGNAL SOCIETY — Main Script v4
   Monolitlabs-inspired motion system
   ======================================== */

// ── Nuclear Fallback: ALWAYS hide loader ──
setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    if (loader && !loader.classList.contains('loaded')) {
        loader.classList.add('loaded');
    }
}, 3000);

window.addEventListener('error', () => {
    const loader = document.getElementById('pageLoader');
    if (loader && !loader.classList.contains('loaded')) {
        loader.classList.add('loaded');
    }
});


// Page Loader
const pageLoader = document.getElementById('pageLoader');
function hideLoader() {
    if (pageLoader) pageLoader.classList.add('loaded');
}
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(hideLoader, 300);
});
setTimeout(hideLoader, 2000);


// Shutter Animation
const shutter = document.getElementById('shutter');
if (shutter) {
    setTimeout(() => {
        shutter.classList.add('done');
        setTimeout(() => { shutter.style.display = 'none'; }, 400);
    }, 1200);
}


// Supabase
const SUPABASE_URL = 'https://iemdkhpvatoewujqlbbh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbWRraHB2YXRvZXd1anFsYmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDE2MjUsImV4cCI6MjEwMzQ3NzYyNX0.EIzkjs9Md72aKzowpIHiLKj7eR7rxbv4noNS_fzzoBE';
let supabase = null;
try {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.warn('Supabase SDK not loaded — form submissions will be unavailable.');
    }
} catch (e) {
    console.warn('Supabase init failed:', e);
}


// Cursor Glow
const cursorGlow = document.getElementById('cursorGlow');
if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow && !cursorGlow.classList.contains('active')) {
            cursorGlow.classList.add('active');
        }
        requestAnimationFrame(() => {
            if (cursorGlow) {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            }
        });
    });
    document.addEventListener('mouseleave', () => {
        if (cursorGlow) cursorGlow.classList.remove('active');
    });
}


// Telemetry Bar — Live scroll + coords
const telemetry = document.getElementById('telemetry');
if (telemetry) {
    const spans = telemetry.querySelectorAll('.mono-label');
    function updateTelemetry() {
        const scrollPct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        const x = Math.round(window.scrollX);
        const y = Math.round(window.scrollY);
        if (spans[0]) spans[0].textContent = `SCRL ${String(scrollPct).padStart(3, '0')}%`;
        if (spans[1]) spans[1].textContent = `X ${String(x).padStart(4, '0')} · Y ${String(y).padStart(4, '0')}`;
        const now = new Date();
        const baliTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Makassar', hour12: false });
        if (spans[2]) spans[2].textContent = `BALI ${baliTime}`;
    }
    window.addEventListener('scroll', updateTelemetry, { passive: true });
    updateTelemetry();
}


// Navigation
const siteHeader = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('site-header--scrolled', window.scrollY > 20);
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileMenu.setAttribute('aria-hidden', !mobileMenu.classList.contains('active'));
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    });
});


// Smooth Scroll with page transition labels
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 72;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});


// Scroll Reveal — IntersectionObserver with stagger
const revealElements = document.querySelectorAll('.reveal, .reveal-lines');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach((el, i) => {
    revealObserver.observe(el);
});

// Stagger siblings within grid containers
document.querySelectorAll('.packages__grid, .services__grid, .team__grid, .faq__grid, .projects__grid').forEach(grid => {
    const items = grid.querySelectorAll('.reveal');
    items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.06}s`;
    });
});


// Testimonial Carousel
const testimonialEntries = document.querySelectorAll('.tc-entry');
const testimonialIndex = document.getElementById('testimonialIndex');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtnDesktop = document.getElementById('nextTestimonialDesktop');
const nextBtn = document.getElementById('nextTestimonial');
let currentTestimonial = 0;
const totalTestimonials = testimonialEntries.length;

function showTestimonial(index) {
    testimonialEntries.forEach((entry, i) => {
        entry.hidden = i !== index;
        entry.style.display = i === index ? 'block' : 'none';
    });
    currentTestimonial = index;
    if (testimonialIndex) {
        testimonialIndex.textContent = String(index + 1).padStart(2, '0');
    }
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        const next = currentTestimonial === 0 ? totalTestimonials - 1 : currentTestimonial - 1;
        showTestimonial(next);
    });
}

if (nextBtnDesktop) {
    nextBtnDesktop.addEventListener('click', () => {
        const next = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
        showTestimonial(next);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const next = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
        showTestimonial(next);
    });
}

// Initialize
showTestimonial(0);


// Contact Form
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btnText = submitBtn.querySelector('.btn__text');
        const btnLoading = submitBtn.querySelector('.btn__loading');

        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;
        formMessage.textContent = '';
        formMessage.className = 'form__message';

        const formData = {
            name: contactForm.name.value.trim(),
            email: contactForm.email.value.trim(),
            company: contactForm.company.value.trim(),
            service: contactForm.service.value,
            message: contactForm.message.value.trim(),
        };

        try {
            if (!supabase) throw new Error('Supabase not initialized');
            const { error } = await supabase.from('contact_submissions').insert([formData]);
            if (error) throw error;
            formMessage.textContent = 'Thank you! We\'ll be in touch soon.';
            formMessage.classList.add('form__message--success');
            contactForm.reset();
        } catch (err) {
            console.error('Supabase error:', err);
            formMessage.textContent = 'Something went wrong. Please try again or email us directly.';
            formMessage.classList.add('form__message--error');
        } finally {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}


// Nav active link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.site-header__link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 100) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--white)';
        }
    });
});


// Magnetic buttons
if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn--solid, .btn--accent, .btn--line').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}


// Smooth anchor offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
