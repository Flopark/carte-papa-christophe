
'use strict';
(() => {
  const theme = document.body.classList.contains('papa') ? 'papa' : 'maman';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const photos = Array.isArray(window.CARD_PHOTOS) ? window.CARD_PHOTOS : [];
  const safePath = value => typeof value === 'string' && /^photos\/[a-zA-Z0-9_./-]+\.(jpe?g|png|webp|avif)$/i.test(value) && !value.includes('..');
  const validPhotos = photos.filter(photo => photo && safePath(photo.src));
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  let previousFocus;

  function openPhoto(photo, trigger) {
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt || 'Chrystelle et Christophe ensemble';
    lightboxCaption.textContent = photo.caption || '';
    previousFocus = trigger;
    lightbox.showModal();
    document.body.style.overflow = 'hidden';
  }
  function closePhoto() { lightbox.close(); }
  document.querySelector('.lightbox-close').addEventListener('click', closePhoto);
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closePhoto(); });
  lightbox.addEventListener('close', () => { document.body.style.overflow = ''; if (previousFocus) previousFocus.focus(); });

  if (validPhotos.length) {
    gallery.replaceChildren();
    document.getElementById('preview-note').hidden = true;
    validPhotos.forEach((photo, index) => {
      const figure = document.createElement('figure');
      figure.className = 'photo-card';
      figure.style.setProperty('--tilt', [-3, 2, -2][index % 3] + 'deg');
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'photo-button';
      button.setAttribute('aria-label', 'Agrandir la photo : ' + (photo.caption || 'souvenir ' + (index + 1)));
      const wrap = document.createElement('div'); wrap.className = 'photo-img-wrap';
      const img = document.createElement('img');
      img.src = photo.src; img.alt = photo.alt || 'Chrystelle et Christophe ensemble';
      img.loading = 'lazy'; img.decoding = 'async'; img.style.objectPosition = photo.position || '50% 50%';
      img.addEventListener('error', () => { figure.hidden = true; });
      const caption = document.createElement('figcaption'); caption.textContent = photo.caption || '';
      wrap.append(img); button.append(wrap); figure.append(button, caption); gallery.append(figure);
      button.addEventListener('click', () => openPhoto(photo, button));
    });
    const main = validPhotos.find(photo => photo.hero) || validPhotos[0];
    const hero = document.getElementById('hero-photo');
    const img = document.createElement('img'); img.alt = main.alt || 'Chrystelle et Christophe ensemble';
    img.src = main.src; img.fetchPriority = 'high'; img.style.objectPosition = main.position || '50% 50%';
    img.addEventListener('error', () => { img.remove(); }, { once: true });
    img.addEventListener('load', () => {
      if (theme === 'papa') hero.replaceChildren(img);
      else { const placeholder = hero.querySelector('.garden-photo-placeholder'); if (placeholder) placeholder.replaceWith(img); }
    }, { once: true });
    if (theme === 'papa') hero.append(img);
  }

  const trigger = document.querySelector('.surprise-button');
  const surprise = document.getElementById('surprise');
  let celebrated = false;
  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!isOpen)); surprise.hidden = isOpen;
    if (!isOpen && !celebrated && !reducedMotion) { celebrate(); celebrated = true; }
    if (!isOpen) surprise.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'nearest' });
  });
  function celebrate() {
    const container = document.getElementById('celebration');
    const colors = theme === 'papa' ? ['#e41d3d', '#c5d5ed', '#ffffff', '#91aaca'] : ['#d5a4b4', '#b3c1a4', '#e7cfa8', '#d0bfdc'];
    for (let i = 0; i < 45; i++) {
      const petal = document.createElement('span'); petal.className = 'confetti';
      petal.style.setProperty('--left', (Math.random() * 100) + '%');
      petal.style.setProperty('--size', (5 + Math.random() * 8) + 'px');
      petal.style.setProperty('--radius', theme === 'maman' ? '70% 0 70% 0' : '1px');
      petal.style.setProperty('--color', colors[i % colors.length]);
      petal.style.setProperty('--duration', (3 + Math.random() * 2) + 's');
      petal.style.setProperty('--delay', (Math.random() * .6) + 's');
      petal.style.setProperty('--drift', ((Math.random() - .5) * 220) + 'px');
      container.append(petal);
    }
    window.setTimeout(() => container.replaceChildren(), 6500);
  }
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08 });
    document.querySelectorAll('.letter, .section-intro, .gallery, .closing>h2').forEach(item => { item.classList.add('reveal'); observer.observe(item); });
  }
})();
