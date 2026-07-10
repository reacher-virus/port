const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-toggle-label');
const progressBar = document.querySelector('.page-progress span');
const copyButton = document.querySelector('[data-copy-email]');
const copyStatus = document.querySelector('.copy-status');

const setTheme = (theme) => {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeToggle?.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
  if (themeLabel) themeLabel.textContent = isDark ? 'Light' : 'Theme';
};

try {
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') setTheme(savedTheme);
} catch {
  // The portfolio still works when browser storage is unavailable.
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
  setTheme(nextTheme);
  try { localStorage.setItem('portfolio-theme', nextTheme); } catch { /* no-op */ }
});

toggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
  toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
  observer.observe(element);
});

const updateProgress = () => {
  if (!progressBar) return;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
};

updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);

copyButton?.addEventListener('click', async () => {
  const email = copyButton.dataset.copyEmail;
  if (!email) return;

  try {
    await navigator.clipboard.writeText(email);
    copyButton.textContent = 'Copied!';
    if (copyStatus) copyStatus.textContent = 'Email address copied to your clipboard.';
  } catch {
    if (copyStatus) copyStatus.textContent = 'Copy is unavailable—please use the email link above.';
    return;
  }

  window.setTimeout(() => {
    copyButton.textContent = 'Copy email';
    if (copyStatus) copyStatus.textContent = '';
  }, 2200);
});

// --- UPDATED CONTACT FORM LOGIC ---
// --- UPDATED CONTACT FORM LOGIC ---
const contactForm = document.querySelector('[data-contact-form]');
const formSubmitButton = contactForm?.querySelector('.form-submit');
const formStatus = contactForm?.querySelector('.form-status');

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const originalLabel = formSubmitButton?.innerHTML;
  if (formSubmitButton) {
    formSubmitButton.disabled = true;
    formSubmitButton.textContent = 'Sending…';
  }
  
  if (formStatus) {
    formStatus.textContent = '';
    formStatus.style.color = 'inherit';
  }
  
  const formData = new FormData(contactForm);

  try {
    // Explicitly pointing to your new Vercel serverless function route
    const response = await fetch('/api/contact', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message")
      })
    });

    const data = await response.json();

  if (!response.ok) {
  const errorData = await response.json();

  console.log("Resend Response:", errorData);

  throw new Error(JSON.stringify(errorData));
}

    // Success state
    contactForm.reset();
    if (formStatus) {
      formStatus.textContent = "Message sent—thanks for reaching out.";
      formStatus.style.color = '#4caf50'; // Green success text
    }

  } catch (error) {
  console.error("Full Error:", error);

  return res.status(500).json({
    error: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined
  });
}
  } finally {
    // This ALWAYS runs, ensuring the button resets whether it succeeded or failed
    if (formSubmitButton) {
      formSubmitButton.disabled = false;
      formSubmitButton.innerHTML = originalLabel;
    }
  }
});
// --- END UPDATED CONTACT FORM LOGIC ---
// --- END UPDATED CONTACT FORM LOGIC ---

const caseStudies = {
  career: {
    label: 'Concept case study / AI agent',
    title: 'Career Compass AI',
    summary: 'A career-decision companion that turns an uploaded resume, a goal and a job-market question into a focused action plan.',
    challenge: 'Career advice is often generic, while resumes alone do not reveal the most valuable next move.',
    approach: 'Extract skills and experience from a resume, compare them with a chosen direction, then give the user clear, grounded recommendations.',
    stack: ['Python', 'LLM workflow', 'Resume parsing', 'Skill graph', 'REST API'],
    architecture: ['Resume upload', 'Skills + experience parser', 'Career reasoning agent', 'Roadmap + feedback'],
    links: [{ label: 'Visit GitHub profile', url: 'https://github.com/reacher-virus' }],
    note: 'System map shown as a proposed implementation blueprint—update it as the project evolves.'
  },
  moodwave: {
    label: 'Concept case study / Recommender',
    title: 'Moodwave AI',
    summary: 'A music recommender designed to respond to how someone feels in the moment, not only what they have played before.',
    challenge: 'Listening history is useful, but it misses the context behind why a listener wants a particular kind of music now.',
    approach: 'Classify an emotional signal, blend it with listening preferences, and rerank tracks through a feedback-aware recommendation loop.',
    stack: ['Python', 'Emotion ML', 'Embeddings', 'Ranking model', 'Music API'],
    architecture: ['Mood signal', 'Emotion classifier', 'Preference profile', 'Ranked music queue'],
    links: [{ label: 'Visit GitHub profile', url: 'https://github.com/reacher-virus' }],
    note: 'System map shown as a proposed implementation blueprint—update it as the project evolves.'
  },
  fieldsense: {
    label: 'Concept case study / Predictive ML',
    title: 'FieldSense',
    summary: 'A crop-yield forecasting concept that makes historical agricultural data easier to turn into useful planning signals.',
    challenge: 'Farm decisions happen under uncertainty; a forecast should show a useful direction without hiding the limits of the data.',
    approach: 'Prepare weather, soil and historical-yield features, evaluate a prediction model, and present a confidence-aware forecast.',
    stack: ['Python', 'Pandas', 'Scikit-learn', 'Feature pipeline', 'Data visualisation'],
    architecture: ['Weather + soil data', 'Feature pipeline', 'Yield prediction model', 'Forecast dashboard'],
    links: [{ label: 'Visit GitHub profile', url: 'https://github.com/reacher-virus' }],
    note: 'System map shown as a proposed implementation blueprint—update it as the project evolves.'
  },
  campus: {
    label: 'Live build / Full-stack web',
    title: 'College Website',
    summary: 'A responsive digital front door designed to make campus information easier to discover for students, visitors and the wider community.',
    challenge: 'Institutional information is easy to publish but harder to structure clearly for the people trying to find it.',
    approach: 'Keep the experience responsive and content-led, with straightforward navigation and a reliable path to essential information.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Responsive UI', 'Content structure'],
    architecture: ['Campus content', 'Responsive interface', 'Structured routes', 'Visitor experience'],
    links: [
      { label: 'Visit live site', url: 'https://college-nu-rust.vercel.app/' },
      { label: 'Visit GitHub profile', url: 'https://github.com/reacher-virus' }
    ],
    note: 'This case study describes the project experience; use the live link to explore the current build.'
  }
};

const caseModal = document.querySelector('#case-modal');
const casePanel = document.querySelector('.case-modal-panel');
const caseContent = document.querySelector('.case-modal-content');
const projectTriggers = document.querySelectorAll('[data-project]');
let lastCaseTrigger = null;

const renderCaseStudy = (study) => {
  const architecture = study.architecture.map((node, index) => {
    const arrow = index < study.architecture.length - 1 ? '<span class="architecture-arrow" aria-hidden="true">→</span>' : '';
    return `<span class="architecture-node">${node}</span>${arrow}`;
  }).join('');
  const stack = study.stack.map((item) => `<li>${item}</li>`).join('');
  const links = study.links.map((link) => `<a class="case-link" href="${link.url}" target="_blank" rel="noreferrer">${link.label} <span>↗</span></a>`).join('');

  return `
    <p class="case-kicker">${study.label}</p>
    <h2 class="case-title" id="case-title">${study.title}</h2>
    <p class="case-summary">${study.summary}</p>
    <div class="case-overview">
      <article><p>The problem</p><h3>${study.challenge}</h3></article>
      <article><p>Engineering approach</p><h3>${study.approach}</h3></article>
    </div>
    <section class="case-architecture" aria-label="System architecture">
      <p>System map / proposed flow</p>
      <div class="architecture-flow">${architecture}</div>
    </section>
    <div class="case-bottom">
      <article><h3>Core stack</h3><ul class="case-stack">${stack}</ul></article>
      <article><h3>Why it matters</h3><p>The aim is a focused product that exposes a clear decision path instead of a black-box answer.</p></article>
    </div>
    <div class="case-actions">${links}<p class="case-note">${study.note}</p></div>
  `;
};

const closeCaseStudy = () => {
  if (!caseModal || caseModal.hidden) return;
  caseModal.hidden = true;
  document.body.classList.remove('modal-open');
  lastCaseTrigger?.focus();
};

projectTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const study = caseStudies[trigger.dataset.project];
    if (!study || !caseModal || !caseContent) return;
    lastCaseTrigger = trigger;
    caseContent.innerHTML = renderCaseStudy(study);
    caseModal.hidden = false;
    document.body.classList.add('modal-open');
    window.setTimeout(() => casePanel?.focus(), 0);
  });
});

document.querySelectorAll('[data-close-modal]').forEach((element) => {
  element.addEventListener('click', closeCaseStudy);
});

document.addEventListener('keydown', (event) => {
  if (!caseModal || caseModal.hidden) return;
  if (event.key === 'Escape') {
    closeCaseStudy();
    return;
  }
  if (event.key !== 'Tab') return;

  const focusable = caseModal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
})
