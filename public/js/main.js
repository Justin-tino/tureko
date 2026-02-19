// Tureko — main.js

// ── Loader dismiss (show only once per browser session) ───────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // If already seen this session, loader was already hidden inline — do nothing
  if (sessionStorage.getItem('loaderShown')) return;

  // First visit: run the animation then hide
  setTimeout(() => {
    loader.classList.add('hidden');
    sessionStorage.setItem('loaderShown', '1');
  }, 2300);
});

// ── Navbar scroll glass effect ────────────────────────────────
const navbar      = document.getElementById('navbar');
const scrollTopEl = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (navbar)      navbar.classList.toggle('scrolled', y > 40);
  if (scrollTopEl) scrollTopEl.classList.toggle('show', y > 420);
});

// ── Scroll to top ─────────────────────────────────────────────
scrollTopEl && scrollTopEl.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Mobile hamburger ──────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle && navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)'   : '';
  spans[1].style.opacity   = open ? '0'                                    : '';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});
document.querySelectorAll('.nav-link').forEach(l =>
  l.addEventListener('click', () => navLinks && navLinks.classList.remove('open')));

// ── Intersection Observer — fade-in ──────────────────────────
const io = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.fade').forEach(el => io.observe(el));

// ── Input error reset ─────────────────────────────────────────
document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => {
    el.classList.remove('err');
    const em = el.parentElement.querySelector('.err-msg');
    if (em) em.style.display = 'none';
  });
});

// ── Contact Form ──────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateContact()) return;

    const btn = contactForm.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch(contactForm.action, {
        method:  'POST',
        body:    new FormData(contactForm),
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        contactForm.style.display = 'none';
        document.getElementById('contactOk').style.display = 'block';
      } else {
        btn.disabled = false;
        btn.textContent = 'Submit Request';
        alert('Submission failed. Please try again.');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Submit Request';
      alert('Network error. Please check your connection.');
    }
  });
}

function validateContact() {
  let ok = true;
  const fields = [
    { id: 'contactPerson', msg: 'Contact person name is required.' },
    { id: 'email',         msg: 'Email address is required.'       },
  ];
  fields.forEach(({ id, msg }) => {
    const el  = document.getElementById(id);
    const err = document.getElementById(id + 'Err');
    if (el && !el.value.trim()) {
      el.classList.add('err');
      if (err) { err.textContent = msg; err.style.display = 'block'; }
      ok = false;
    }
  });
  const emailEl = document.getElementById('email');
  if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailEl.classList.add('err');
    const errEl = document.getElementById('emailErr');
    if (errEl) { errEl.textContent = 'Please enter a valid email address.'; errEl.style.display = 'block'; }
    ok = false;
  }
  const agree = document.getElementById('agree');
  if (agree && !agree.checked) {
    alert('Please agree to the terms to continue.');
    ok = false;
  }
  return ok;
}

// ── Careers Form ──────────────────────────────────────────────
const careersForm = document.getElementById('careersForm');
if (careersForm) {
  careersForm.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    [['fullName', 'Full name is required.'], ['careerEmail', 'Email is required.']].forEach(([id, msg]) => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) { el.classList.add('err'); ok = false; }
    });
    const agreeC = document.getElementById('agreeCareer');
    if (agreeC && !agreeC.checked) { alert('Please agree to the terms.'); ok = false; }
    if (!ok) return;

    const btn = careersForm.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    try {
      const res = await fetch(careersForm.action, {
        method:  'POST',
        body:    new FormData(careersForm),
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        careersForm.style.display = 'none';
        document.getElementById('careerOk').style.display = 'block';
      } else {
        btn.disabled = false;
        btn.textContent = 'Submit Application';
        alert('Submission failed. Please try again.');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Submit Application';
    }
  });
}
