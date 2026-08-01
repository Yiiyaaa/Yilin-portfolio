(function () {
  'use strict';

  const source = window.YILIN_GALLERY_DATA || { version: 1, galleries: {} };
  let state = JSON.parse(JSON.stringify(source));

  function itemNode(item, kind) {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.loading = 'lazy';
    image.decoding = 'async';
    image.src = item.src;
    image.alt = item.alt || '';
    figure.dataset.galleryItemId = item.id;
    if (kind === 'portfolio') {
      figure.className = 'portfolio-frame image-card';
      figure.append(image);
      if (item.caption) {
        const caption = document.createElement('figcaption');
        caption.className = 'portfolio-caption';
        caption.textContent = item.caption;
        figure.append(caption);
      }
    } else {
      figure.className = 'ev';
      figure.tabIndex = 0;
      figure.setAttribute('role', 'button');
      figure.setAttribute('aria-label', '放大查看证据图' + (item.caption ? '：' + item.caption : ''));
      figure.append(image);
      if (item.caption) {
        const caption = document.createElement('figcaption');
        caption.textContent = item.caption;
        figure.append(caption);
      }
    }
    return figure;
  }

  function openLightbox(key, itemId) {
    const gallery = state.galleries[key];
    if (!gallery || !window.YL || !window.YL.openLightbox) return;
    const index = gallery.items.findIndex((item) => item.id === itemId);
    if (index < 0) return;
    window.YL.openLightbox(gallery.items.map((item) => ({
      src: item.src, alt: item.alt || '', caption: item.caption || ''
    })), index);
  }

  function wireOpen(container, key) {
    if (container.dataset.galleryOpenWired) return;
    container.dataset.galleryOpenWired = '1';
    const activate = (event) => {
      const figure = event.target.closest('[data-gallery-item-id]');
      if (!figure || !container.contains(figure)) return;
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
      if (event.type === 'keydown') event.preventDefault();
      openLightbox(key, figure.dataset.galleryItemId);
    };
    container.addEventListener('click', activate);
    container.addEventListener('keydown', activate);
  }

  function renderPortfolio(key) {
    const container = document.querySelector('[data-yilin-gallery="' + key + '"]');
    const gallery = state.galleries[key];
    if (!container || !gallery) return;
    container.replaceChildren(...gallery.items.map((item) => itemNode(item, 'portfolio')));
  }

  function renderLab(key) {
    const card = document.querySelector('[data-lab="' + key.replace(/^lab-/, '') + '"]');
    const gallery = state.galleries[key];
    if (!card || !gallery) return;
    card.querySelector('[data-gallery-evidence]')?.remove();
    if (!gallery.items.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'evidence';
    wrap.dataset.galleryEvidence = key;
    const label = document.createElement('div');
    label.className = 'evidence-label';
    label.textContent = '证据';
    const strip = document.createElement('div');
    strip.className = 'ev-strip';
    strip.append(...gallery.items.map((item) => itemNode(item, 'evidence')));
    wrap.append(label, strip);
    wireOpen(strip, key);
    const toggle = card.querySelector('.a-toggle');
    if (toggle) card.insertBefore(wrap, toggle); else card.append(wrap);
  }

  function render(key) {
    if (key.startsWith('lab-')) renderLab(key); else renderPortfolio(key);
    document.dispatchEvent(new CustomEvent('yilin:gallery-rendered', { detail: { key } }));
  }

  function renderAll() {
    Object.keys(state.galleries).forEach(render);
  }

  function snapshot() {
    return JSON.parse(JSON.stringify(state));
  }

  function apply(next) {
    state = JSON.parse(JSON.stringify(next || { version: 1, galleries: {} }));
    window.YILIN_GALLERY_DATA = snapshot();
    renderAll();
  }

  function locate(key, itemId) {
    const selector = '[data-yilin-gallery="' + key + '"] [data-gallery-item-id="' + itemId + '"], ' +
      '[data-gallery-evidence="' + key + '"] [data-gallery-item-id="' + itemId + '"]';
    const target = document.querySelector(selector);
    if (!target) return false;
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    target.classList.add('yilin-gallery-located');
    setTimeout(() => target.classList.remove('yilin-gallery-located'), 1800);
    return true;
  }

  window.YilinGalleryEditor = { snapshot, apply, render, renderAll, locate };
  renderAll();
})();
