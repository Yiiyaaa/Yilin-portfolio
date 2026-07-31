(function () {
  'use strict';

  const source = window.YILIN_SITE_CONTENT || {};
  const state = {
    version: 1,
    text: { ...(source.text || {}) },
    images: { ...(source.images || {}) },
    links: { ...(source.links || {}) },
    orders: { ...(source.orders || {}) }
  };

  const textElements = new Map();
  const textOriginals = new Map();
  const imageElements = new Map();
  const imageOriginals = new Map();
  const linkElements = new Map();
  const linkOriginals = new Map();
  const orderGroups = new Map();

  const TEXT_SELECTORS = [
    'header .brand', 'header nav a',
    '.hero .eyebrow', '.hero .display-cn', '.hero .latin-name',
    '.hero .hero-title-text', '.hero .hero-sub', '.hero-meta .k', '.hero-meta .v',
    '.marquee-track span',
    'main .section-head .kicker', 'main .section-head h2', 'main .section-head p',
    'main .card .num', 'main .card h3', 'main .card > p', 'main .tagline',
    'main .project-head .index', 'main .pill', 'main .portfolio-caption',
    'main .assistant .index', 'main .assistant .a-role', 'main .assistant .status',
    'main .assistant .a-line', 'main .assistant dt', 'main .assistant dd',
    'main .fl b', 'main .fl span', 'main .comic-note', 'main .comic-slot',
    'main .step time', 'main .step h3', 'main .step li',
    'main table th', 'main table td',
    'main .manual-list li', 'main .principle-list li',
    'main .fragment', 'main .contact h2', 'main .contact-inner > p',
    'main .contact-links a', 'footer span'
  ].join(',');

  const EXCLUDED_AREAS = '.preloader,.toast,.modal,.scroll-cue,.a-toggle,.skip-link';

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeHtml(value) {
    return String(value == null ? '' : value).trim();
  }

  function annotateText() {
    const all = Array.from(document.querySelectorAll(TEXT_SELECTORS))
      .filter((element) => !element.closest(EXCLUDED_AREAS));
    const set = new Set(all);
    const editable = all.filter((element) => {
      return !Array.from(element.querySelectorAll(TEXT_SELECTORS)).some((child) => set.has(child));
    });

    editable.forEach((element, index) => {
      const key = `text.${String(index + 1).padStart(4, '0')}`;
      const original = normalizeHtml(element.innerHTML);
      element.dataset.yilinTextKey = key;
      textElements.set(key, element);
      textOriginals.set(key, original);
      if (Object.prototype.hasOwnProperty.call(state.text, key)) {
        element.innerHTML = state.text[key];
      }
    });
  }

  function annotateImages() {
    Array.from(document.querySelectorAll('main img, .hero img')).forEach((element, index) => {
      const key = `image.${String(index + 1).padStart(4, '0')}`;
      const original = { src: element.getAttribute('src') || '', alt: element.getAttribute('alt') || '' };
      element.dataset.yilinImageKey = key;
      imageElements.set(key, element);
      imageOriginals.set(key, original);
      const override = state.images[key];
      if (override) {
        if (override.src) element.setAttribute('src', override.src);
        if (typeof override.alt === 'string') element.setAttribute('alt', override.alt);
      }
    });
  }

  function annotateLinks() {
    Array.from(document.querySelectorAll('a[href]'))
      .filter((element) => !element.classList.contains('skip-link'))
      .forEach((element, index) => {
        const key = `link.${String(index + 1).padStart(4, '0')}`;
        const original = element.getAttribute('href') || '';
        element.dataset.yilinLinkKey = key;
        linkElements.set(key, element);
        linkOriginals.set(key, original);
        if (state.links[key]) element.setAttribute('href', state.links[key]);
      });
  }

  function registerGroup(id, label, container, items) {
    if (!container || items.length < 2) return;
    items.forEach((element, index) => {
      const key = `${id}.${String(index + 1).padStart(2, '0')}`;
      element.dataset.yilinOrderGroup = id;
      element.dataset.yilinOrderKey = key;
    });
    orderGroups.set(id, { id, label, container, items });
  }

  function annotateOrderGroups() {
    const main = document.querySelector('main');
    registerGroup('sections', '页面章节', main, Array.from(main ? main.querySelectorAll(':scope > section') : []));

    const definitions = [
      ['what-cards', 'What I Do 卡片', '#what .grid-3', ':scope > .card'],
      ['work-cards', 'Selected Work 项目', '#work .projects', ':scope > .project-card, :scope > .timeline'],
      ['lab-cards', 'The Lab 卡片', '#lab .lab-grid', ':scope > .assistant'],
      ['advantage-cards', 'Advantages 条目', '#method .steps', ':scope > .step'],
      ['about-cards', 'About 卡片', '#proof .proof-wrap', ':scope > .card'],
      ['now-cards', 'Now 卡片', '#now .now', ':scope > article']
    ];

    definitions.forEach(([id, label, containerSelector, itemSelector]) => {
      const container = document.querySelector(containerSelector);
      registerGroup(id, label, container, Array.from(container ? container.querySelectorAll(itemSelector) : []));
    });
  }

  function orderedItems(group) {
    const saved = Array.isArray(state.orders[group.id]) ? state.orders[group.id] : [];
    const byKey = new Map(group.items.map((item) => [item.dataset.yilinOrderKey, item]));
    const result = [];
    saved.forEach((key) => {
      const item = byKey.get(key);
      if (item) {
        result.push(item);
        byKey.delete(key);
      }
    });
    group.items.forEach((item) => {
      const key = item.dataset.yilinOrderKey;
      if (byKey.has(key)) {
        result.push(item);
        byKey.delete(key);
      }
    });
    return result;
  }

  function applySectionOrder(group) {
    const ordered = orderedItems(group);
    const dividers = Array.from(group.container.querySelectorAll(':scope > .divider'));
    dividers.forEach((divider) => divider.remove());
    ordered.forEach((section, index) => {
      group.container.appendChild(section);
      const next = ordered[index + 1];
      const touchesContact = section.classList.contains('contact') || next?.classList.contains('contact');
      if (next && !touchesContact) {
        const divider = dividers[index] || document.createElement('hr');
        divider.className = 'divider';
        group.container.appendChild(divider);
      }
    });
    group.items = ordered;
    renumberSections(ordered);
    reorderNavigation(ordered);
  }

  function applyRegularOrder(group) {
    const ordered = orderedItems(group);
    ordered.forEach((item) => group.container.appendChild(item));
    group.items = ordered;
  }

  function applyGroupOrder(group) {
    if (group.id === 'sections') applySectionOrder(group);
    else applyRegularOrder(group);
  }

  function renumberSections(sections) {
    sections.forEach((section, index) => {
      const kicker = section.querySelector(':scope > .section-head .kicker, :scope > .contact-inner .kicker');
      if (!kicker) return;
      const number = String(index + 1).padStart(2, '0');
      const text = kicker.textContent.replace(/^\s*\d{1,2}\s*[—-]\s*/, '');
      kicker.textContent = `${number} — ${text}`;
    });
  }

  function reorderNavigation(sections) {
    const nav = document.querySelector('header nav');
    if (!nav) return;
    const links = Array.from(nav.querySelectorAll(':scope > a[href^="#"]'));
    const byTarget = new Map(links.map((link) => [link.getAttribute('href').slice(1), link]));
    sections.forEach((section) => {
      const link = section.id ? byTarget.get(section.id) : null;
      if (link) nav.appendChild(link);
    });
  }

  function applyAllOrders() {
    orderGroups.forEach((group) => {
      if (Array.isArray(state.orders[group.id]) && state.orders[group.id].length) {
        applyGroupOrder(group);
      }
    });
  }

  function labelFor(element, fallback) {
    const heading = element.matches('section')
      ? element.querySelector('.section-head h2, .contact-inner h2')
      : element.querySelector('h3, h2');
    const label = (heading || element).textContent.replace(/\s+/g, ' ').trim();
    return label.slice(0, 42) || fallback;
  }

  function getGroups() {
    return Array.from(orderGroups.values()).map((group) => ({
      id: group.id,
      label: group.label,
      items: group.items.map((element) => ({
        key: element.dataset.yilinOrderKey,
        label: labelFor(element, element.dataset.yilinOrderKey)
      }))
    }));
  }

  function move(groupId, key, direction) {
    const group = orderGroups.get(groupId);
    if (!group) return false;
    const keys = group.items.map((item) => item.dataset.yilinOrderKey);
    const index = keys.indexOf(key);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= keys.length) return false;
    [keys[index], keys[next]] = [keys[next], keys[index]];
    state.orders[groupId] = keys;
    applyGroupOrder(group);
    return true;
  }

  function setText(key, html) {
    const element = textElements.get(key);
    if (!element) return false;
    state.text[key] = normalizeHtml(html);
    element.innerHTML = state.text[key];
    return true;
  }

  function prepareText(key) {
    const element = textElements.get(key);
    if (!element) return null;
    const html = Object.prototype.hasOwnProperty.call(state.text, key)
      ? state.text[key]
      : textOriginals.get(key);
    element.innerHTML = html;
    return element;
  }

  function setImage(key, value) {
    const element = imageElements.get(key);
    if (!element || !value || !value.src) return false;
    state.images[key] = { src: value.src, alt: String(value.alt || '') };
    element.src = state.images[key].src;
    element.alt = state.images[key].alt;
    return true;
  }

  function setLink(key, href) {
    const element = linkElements.get(key);
    if (!element) return false;
    state.links[key] = String(href || '');
    element.setAttribute('href', state.links[key]);
    return true;
  }

  function describeSelection(element) {
    const text = element.closest('[data-yilin-text-key]');
    const image = element.closest('[data-yilin-image-key]');
    const link = element.closest('[data-yilin-link-key]');
    if (image) {
      const key = image.dataset.yilinImageKey;
      const current = state.images[key] || imageOriginals.get(key);
      return { type: 'image', key, element: image, value: clone(current) };
    }
    if (text) {
      const key = text.dataset.yilinTextKey;
      const html = Object.prototype.hasOwnProperty.call(state.text, key) ? state.text[key] : textOriginals.get(key);
      return {
        type: 'text', key, element: text, html,
        linkKey: link ? link.dataset.yilinLinkKey : null,
        href: link ? (state.links[link.dataset.yilinLinkKey] || linkOriginals.get(link.dataset.yilinLinkKey)) : null
      };
    }
    return null;
  }

  annotateText();
  annotateImages();
  annotateLinks();
  annotateOrderGroups();
  applyAllOrders();

  window.YilinContentEditor = {
    snapshot: () => clone(state),
    getGroups,
    move,
    prepareText,
    setText,
    setImage,
    setLink,
    describeSelection
  };
})();
