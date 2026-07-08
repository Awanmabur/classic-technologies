const body = document.body;
const header = document.getElementById('header');
const loader = document.getElementById('loader');
const progress = document.getElementById('progress');
const topBtn = document.getElementById('top');
const menu = document.getElementById('menu');
const cursor = document.getElementById('cursor');
const floatContact = document.getElementById('floatContact');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
let isMobile = window.matchMedia('(max-width: 760px)').matches || coarsePointer;

window.addEventListener('load', () => setTimeout(() => loader && loader.classList.add('hide'), 280));

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('[data-split]').forEach(el => {
  const words = el.textContent.trim().split(' ');
  el.textContent = '';
  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.setProperty('--i', index);
    el.appendChild(span);
  });
});

function closeMenu(){
  body.classList.remove('menu-open');
  if (menu) menu.setAttribute('aria-expanded', 'false');
}

if (menu) {
  menu.addEventListener('click', event => {
    event.stopPropagation();
    const open = body.classList.toggle('menu-open');
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

document.addEventListener('click', event => {
  if (window.innerWidth <= 900 && body.classList.contains('menu-open') && !event.target.closest('.nav')) closeMenu();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

function scrollToSectionWithNavOffset(hash){
  if (!hash || hash === '#') return false;
  const target = document.querySelector(hash);
  if (!target) return false;

  const navEl = header ? header.querySelector('.nav') : null;
  const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 0;
  const offset = Math.max(5, navBottom + 5);
  const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);

  window.scrollTo({
    top,
    behavior: prefersReducedMotion ? 'auto' : 'smooth'
  });
  history.replaceState(null, '', hash);
  return true;
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', event => {
    const hash = link.getAttribute('href');
    closeMenu();
    if (hash && hash.startsWith('#')) {
      event.preventDefault();
      scrollToSectionWithNavOffset(hash);
    }
  });
});

const scrollCards = [...document.querySelectorAll('[data-scroll-card]')];
const sideDots = [...document.querySelectorAll('#sideDots a')];
const sections = [...document.querySelectorAll('main section[id]')];
let ticking = false;

function update(){
  const y = window.scrollY || window.pageYOffset || 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (progress) progress.style.width = maxScroll > 0 ? `${(y / maxScroll) * 100}%` : '0%';
  if (header) header.classList.toggle('scrolled', y > 24);
  if (topBtn) topBtn.classList.toggle('show', y > 720);
  if (floatContact) floatContact.classList.toggle('show', y > 520);

  // Heavy card parallax made mobile scrolling feel sticky. Keep it on desktop only.
  if (!isMobile && scrollCards.length) {
    scrollCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const amount = Math.max(-1, Math.min(1, (rect.top - window.innerHeight * .62) / window.innerHeight));
      card.style.setProperty('--y', `${amount * 34}px`);
      card.style.setProperty('--rr', `${amount * (index % 2 ? -3 : 3)}deg`);
    });
  }

  if (!isMobile && sideDots.length) {
    let active = 'home';
    sideDots.forEach(dot => {
      const id = dot.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top < window.innerHeight * .48) active = id;
    });
    sideDots.forEach(dot => dot.classList.toggle('active', dot.getAttribute('href') === `#${active}`));
  }
}

function requestUpdate(){
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    update();
    ticking = false;
  });
}

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', () => {
  isMobile = window.matchMedia('(max-width: 760px)').matches || coarsePointer;
  requestUpdate();
}, { passive: true });
update();

if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: isMobile ? .08 : .16, rootMargin: isMobile ? '0px 0px -8% 0px' : '0px' });

document.querySelectorAll('.reveal,.scroll-card,.trust-badge').forEach(el => revealObserver.observe(el));

const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: .01 });
sections.forEach(section => spy.observe(section));

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', event => {
    if (isMobile) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

document.querySelectorAll('.tilt').forEach(el => {
  el.addEventListener('pointermove', event => {
    if (isMobile || window.innerWidth < 760) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    el.style.transform = `rotateX(${((y / rect.height) - .5) * -7}deg) rotateY(${((x / rect.width) - .5) * 7}deg) translateY(-4px)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});

document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('pointermove', event => {
    if (isMobile || window.innerWidth < 760) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * .12}px,${y * .14}px)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});

if (window.matchMedia('(pointer:fine)').matches && cursor) {
  window.addEventListener('pointermove', event => {
    cursor.style.opacity = '1';
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }, { passive: true });
  document.querySelectorAll('a,button,.tilt,.flow-card,.bento-card,.project-stack-card,.trust-badge').forEach(el => {
    el.addEventListener('pointerenter', () => cursor.classList.add('big'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('big'));
  });
}

document.querySelectorAll('.estimate-option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.estimate-option').forEach(btn => btn.classList.remove('active'));
    option.classList.add('active');
    const title = document.getElementById('estimateTitle');
    const desc = document.getElementById('estimateDesc');
    const list = document.getElementById('estimateList');
    if (title) title.textContent = option.dataset.title;
    if (desc) desc.textContent = option.dataset.desc;
    if (list && option.dataset.list) {
      list.innerHTML = '';
      option.dataset.list.split('|').forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
      });
    }
  });
});

document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.closest('.faq-item');
    const answer = item ? item.querySelector('.faq-answer') : null;
    const open = item && item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(faq => {
      faq.classList.remove('open');
      const faqAnswer = faq.querySelector('.faq-answer');
      if (faqAnswer) faqAnswer.style.maxHeight = '0px';
    });
    if (!open && item && answer) {
      item.classList.add('open');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

document.querySelectorAll('.pill').forEach((pill, index, pills) => {
  pill.addEventListener('click', () => {
    pills.forEach(item => item.classList.remove('active'));
    pill.classList.add('active');
  });
});

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (status) status.classList.add('show');
    form.reset();
    setTimeout(() => status && status.classList.remove('show'), 6500);
  });
}

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('show');
    entry.target.querySelectorAll('.count-up').forEach(el => {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      const target = parseInt(el.dataset.value || '0', 10);
      const suffix = el.dataset.suffix || '';
      let start = null;
      function step(timestamp){
        if (start === null) start = timestamp;
        const progressAmount = Math.min(1, (timestamp - start) / (isMobile ? 720 : 1050));
        const eased = 1 - Math.pow(1 - progressAmount, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progressAmount < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
    countObserver.unobserve(entry.target);
  });
}, { threshold: .25 });

document.querySelectorAll('.hero-stat-grid,.hero-stat').forEach(el => countObserver.observe(el));

window.addEventListener('load', () => {
  if (location.hash) {
    setTimeout(() => scrollToSectionWithNavOffset(location.hash), 80);
  }
});
