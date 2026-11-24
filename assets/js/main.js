/* ==========================================================================
   Associação de Mulheres Maria da Glória — interações do site
   --------------------------------------------------------------------------
   Organização:
   1. Utilidades
   2. Cabeçalho, menu e progresso de leitura
   3. Revelação no scroll e contadores
   4. Cardápio
   5. Mural de notícias
   6. Diálogos e ajuda
   7. Preferências de acessibilidade e leitura em voz alta
   8. Passeio guiado
   9. Formulários, cópia e compartilhamento
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js-ready');

  var CONFIG = window.AMMG_CONFIG || {};
  var DATA = window.AMMG_DATA || {};
  var ORG = CONFIG.org || {};
  var FEATURES = CONFIG.features || {};
  var EMAIL = ORG.email || 'angelacomunal@yahoo.com.br';

  /* ------------------------------------------------------------------------
     1. Utilidades
     ------------------------------------------------------------------------ */

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function on(target, event, handler, options) {
    if (target) target.addEventListener(event, handler, options);
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function motionEnabled() {
    return root.getAttribute('data-motion') !== 'off';
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function readStorage(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* O site continua funcionando mesmo sem armazenamento. */
    }
  }

  function readSession(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeSession(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      /* sem problema */
    }
  }

  function showToast(message) {
    var toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3600);
  }

  var dialogOpeners = new WeakMap();
  var lastOutsideOpener = null;

  function openDialog(dialog, opener) {
    if (!dialog) return;

    var candidate = opener || document.activeElement;
    /* Se o botão estiver dentro de outro diálogo, devolvemos o foco ao
       acionador que abriu o primeiro diálogo, e não a um botão escondido. */
    if (candidate && candidate.closest && candidate.closest('dialog')) {
      candidate = lastOutsideOpener || $('.help-fab__btn') || document.body;
    } else {
      lastOutsideOpener = candidate;
    }

    $$('dialog[open]').forEach(function (other) {
      if (other !== dialog) other.close();
    });

    dialogOpeners.set(dialog, candidate);
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  function focusIfPossible(element) {
    if (!element || !document.contains(element)) return;
    try {
      element.focus({ preventScroll: true });
    } catch (error) {
      element.focus();
    }
  }

  /* ------------------------------------------------------------------------
     2. Cabeçalho, menu e progresso de leitura
     ------------------------------------------------------------------------ */

  var header = $('#siteHeader');
  var menuToggle = $('#menuToggle');
  var siteNav = $('#siteNav');
  var progressBar = $('#progressBar');
  var toTop = $('#toTop');
  var navLinks = $$('.site-nav a[href^="#"]');

  function setMenu(open) {
    if (!menuToggle || !siteNav) return;
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    siteNav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    if (open) {
      var firstLink = $('a', siteNav);
      if (firstLink) window.setTimeout(function () { focusIfPossible(firstLink); }, 60);
    }
  }

  on(menuToggle, 'click', function () {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  navLinks.forEach(function (link) {
    on(link, 'click', function () {
      var href = link.getAttribute('href');
      setMenu(false);
      if (href && href.length > 1) {
        var section = document.querySelector(href);
        var heading = section ? section.querySelector('h1, h2') : null;
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          window.setTimeout(function () { focusIfPossible(heading); }, 30);
        }
      }
    });
  });

  on(document, 'keydown', function (event) {
    if (event.key === 'Escape' && menuToggle && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      focusIfPossible(menuToggle);
    }
  });

  on(window, 'resize', function () {
    if (window.innerWidth > 1023 && menuToggle && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
    }
  });

  /* Seção visível no menu */
  var spySections = ['inicio', 'atalhos', 'associacao', 'refeicoes', 'noticias', 'ajudar', 'transparencia', 'visite', 'duvidas']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function updateScrollUi() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);

    if (progressBar) {
      var ratio = Math.min(1, Math.max(0, y / max));
      progressBar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    }

    if (header) header.classList.toggle('is-scrolled', y > 8);

    if (toTop) {
      if (y > 640) {
        toTop.hidden = false;
      } else {
        toTop.hidden = true;
      }
    }

    var probe = y + 150;
    var currentId = '';
    spySections.forEach(function (section) {
      if (section.offsetTop <= probe) currentId = section.id;
    });

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  var scrollQueued = false;
  function queueScrollUi() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(function () {
      scrollQueued = false;
      updateScrollUi();
    });
  }

  on(window, 'scroll', queueScrollUi, { passive: true });
  on(window, 'resize', queueScrollUi);
  updateScrollUi();

  on(toTop, 'click', function () {
    window.scrollTo({ top: 0, behavior: motionEnabled() ? 'smooth' : 'auto' });
    focusIfPossible($('.brand'));
  });

  /* Aviso de prévia */
  var proposalBar = $('#proposalBar');
  if (proposalBar) {
    var dismissed = readSession('ammg-proposal-dismissed') === '1';
    if (CONFIG.isProposal === false || FEATURES.proposalBar === false || dismissed) {
      proposalBar.hidden = true;
    }
    on($('#dismissProposal'), 'click', function () {
      proposalBar.hidden = true;
      writeSession('ammg-proposal-dismissed', '1');
    });
  }

  if (CONFIG.isProposal === false) {
    var footerProposal = $('.footer__proposal');
    if (footerProposal) footerProposal.hidden = true;
  }

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------------
     3. Revelação no scroll e contadores
     ------------------------------------------------------------------------ */

  var reveals = $$('.reveal');

  function showAllReveals() {
    reveals.forEach(function (element) { element.classList.add('is-visible'); });
  }

  if (!('IntersectionObserver' in window) || !motionEnabled()) {
    showAllReveals();
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    reveals.forEach(function (element) { revealObserver.observe(element); });
  }

  function animateCounter(element) {
    var target = parseInt(element.getAttribute('data-count'), 10);
    if (isNaN(target)) return;

    if (!motionEnabled()) {
      element.textContent = String(target);
      return;
    }

    var start = target > 1000 ? Math.max(0, target - 220) : 0;
    var duration = 1400;
    var startedAt = null;

    function frame(now) {
      if (startedAt === null) startedAt = now;
      var progress = Math.min(1, (now - startedAt) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(start + (target - start) * eased);
      element.textContent = String(value);
      if (progress < 1 && motionEnabled()) {
        window.requestAnimationFrame(frame);
      } else {
        element.textContent = String(target);
      }
    }

    window.requestAnimationFrame(frame);
  }

  var counters = $$('[data-count]');
  if (!('IntersectionObserver' in window) || !motionEnabled()) {
    counters.forEach(function (element) {
      element.textContent = element.getAttribute('data-count');
    });
  } else {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (element) { counterObserver.observe(element); });
  }

  /* ------------------------------------------------------------------------
     4. Cardápio
     ------------------------------------------------------------------------ */

  var menuTabs = $('#menuTabs');
  var menuPanel = $('#menuPanel');
  var menuItems = Array.isArray(DATA.menu) ? DATA.menu : [];
  var currentMenu = 0;

  function renderMenu(index) {
    if (!menuPanel || !menuItems.length) return;
    var item = menuItems[index] || menuItems[0];
    menuPanel.innerHTML =
      '<div class="menu-item">' +
        '<span class="menu-item__label">Prato principal</span>' +
        '<strong>' + escapeHtml(item.principal) + '</strong>' +
      '</div>' +
      '<div class="menu-item">' +
        '<span class="menu-item__label">Acompanhamentos</span>' +
        '<ul>' + (item.sides || []).map(function (side) {
          return '<li>' + escapeHtml(side) + '</li>';
        }).join('') + '</ul>' +
      '</div>' +
      '<div class="menu-item">' +
        '<span class="menu-item__label">Sobremesa</span>' +
        '<strong>' + escapeHtml(item.dessert) + '</strong>' +
      '</div>';
  }

  function selectMenu(index, focusTab) {
    if (!menuTabs || !menuItems.length) return;
    var tabs = $$('.menu-tab', menuTabs);
    if (!tabs[index]) return;
    currentMenu = index;

    tabs.forEach(function (tab, tabIndex) {
      var selected = tabIndex === index;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.setAttribute('tabindex', selected ? '0' : '-1');
    });

    if (menuPanel) {
      menuPanel.setAttribute('aria-labelledby', tabs[index].id);
      menuPanel.classList.add('is-switching');
    }

    window.setTimeout(function () {
      renderMenu(index);
      if (menuPanel) menuPanel.classList.remove('is-switching');
    }, motionEnabled() ? 150 : 0);

    if (focusTab) tabs[index].focus();
  }

  if (menuTabs && menuItems.length) {
    var today = new Date().getDay();
    var initialMenu = today >= 1 && today <= 6 ? today - 1 : 0;
    if (initialMenu >= menuItems.length) initialMenu = 0;

    menuTabs.innerHTML = menuItems.map(function (item, index) {
      return '<button class="menu-tab" type="button" role="tab" id="menuTab-' + escapeHtml(item.id) + '"' +
        ' aria-controls="menuPanel" aria-selected="' + (index === initialMenu ? 'true' : 'false') + '"' +
        ' tabindex="' + (index === initialMenu ? '0' : '-1') + '">' +
        escapeHtml(item.short || item.label) +
        '<span class="sr-only"> — ' + escapeHtml(item.label) + '</span>' +
      '</button>';
    }).join('');

    renderMenu(initialMenu);
    if (menuPanel && menuItems[initialMenu]) {
      menuPanel.setAttribute('aria-labelledby', 'menuTab-' + menuItems[initialMenu].id);
    }

    on(menuTabs, 'click', function (event) {
      var tab = event.target.closest('.menu-tab');
      if (!tab) return;
      var index = $$('.menu-tab', menuTabs).indexOf(tab);
      if (index >= 0) selectMenu(index);
    });

    on(menuTabs, 'keydown', function (event) {
      var tabs = $$('.menu-tab', menuTabs);
      var index = tabs.indexOf(document.activeElement);
      if (index < 0) return;
      var next = null;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      selectMenu(next, true);
    });
  }

  /* ------------------------------------------------------------------------
     5. Mural de notícias
     ------------------------------------------------------------------------ */

  var newsGrid = $('#newsGrid');
  var newsFilters = $('#newsFilters');
  var newsDialog = $('#newsDialog');
  var newsContent = $('#newsContent');
  var newsCategory = $('#newsCategory');
  var newsItems = Array.isArray(DATA.news) ? DATA.news : [];
  var activeFilter = 'all';
  var lastNewsOpener = null;

  function renderNews() {
    if (!newsGrid) return;
    var filtered = newsItems.filter(function (item) {
      return activeFilter === 'all' || item.category === activeFilter;
    });

    if (!filtered.length) {
      newsGrid.innerHTML = '<p class="news-empty">Ainda não há notícias nesta categoria. Escolha outra opção ou volte para “Todas”.</p>';
      return;
    }

    var categoryIcons = {
      cozinha: 'i-bowl',
      cursos: 'i-book',
      parcerias: 'i-users',
      reconhecimento: 'i-heart'
    };

    var firstIsFeatured = Boolean(filtered[0] && filtered[0].image);
    var remainingCards = firstIsFeatured ? filtered.length - 1 : filtered.length;
    var lastCardIsAlone = remainingCards % 2 === 1;

    newsGrid.innerHTML = filtered.map(function (item, index) {
      var featured = index === 0 && Boolean(item.image);
      var wide = lastCardIsAlone && index === filtered.length - 1 && !featured;
      var image = item.image
        ? '<div class="news-card__media"><img src="' + escapeHtml(item.image) + '" alt="' +
            escapeHtml(item.imageAlt || '') + '"' + (featured ? '' : ' loading="lazy"') + '></div>'
        : '<div class="news-card__media news-card__media--placeholder news-card__media--' +
            escapeHtml(item.category) + '" aria-hidden="true"><svg class="icon"><use href="#' +
            (categoryIcons[item.category] || 'i-sparkle') + '"></use></svg></div>';

      return '<article class="news-card' + (featured ? ' news-card--featured' : '') +
        (wide ? ' news-card--wide' : '') + '">' +
        image +
        '<div class="news-card__body">' +
          '<div class="news-card__meta">' +
            '<span class="badge badge--' + escapeHtml(item.category) + '">' + escapeHtml(item.categoryLabel) + '</span>' +
            '<span class="news-card__date">' +
              '<svg class="icon" aria-hidden="true"><use href="#i-calendar"></use></svg>' +
              escapeHtml(item.dateLabel) +
            '</span>' +
          '</div>' +
          '<h3 class="news-card__title">' + escapeHtml(item.title) + '</h3>' +
          '<p class="news-card__summary">' + escapeHtml(item.summary) + '</p>' +
          '<button class="news-card__link" type="button" data-news="' + escapeHtml(item.id) + '">' +
            'Ler resumo' +
            '<svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>' +
          '</button>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function openNews(id, opener) {
    var item = newsItems.filter(function (news) { return news.id === id; })[0];
    if (!item || !newsDialog || !newsContent) return;

    lastNewsOpener = opener || document.activeElement;

    if (newsCategory) {
      newsCategory.textContent = item.categoryLabel;
      newsCategory.className = 'badge badge--' + item.category;
    }

    newsContent.innerHTML =
      (item.image
        ? '<img class="news-modal__image" src="' + escapeHtml(item.image) + '" alt="' +
            escapeHtml(item.imageAlt || '') + '">'
        : '') +
      '<div class="news-modal__meta">' +
        '<span class="badge badge--' + escapeHtml(item.category) + '">' + escapeHtml(item.categoryLabel) + '</span>' +
        '<span>' + escapeHtml(item.dateLabel) + '</span>' +
      '</div>' +
      '<h2 id="newsTitle">' + escapeHtml(item.title) + '</h2>' +
      '<div class="news-modal__body">' +
        (item.body || []).map(function (paragraph) {
          return '<p>' + escapeHtml(paragraph) + '</p>';
        }).join('') +
      '</div>' +
      '<div class="news-modal__source">' +
        '<a class="btn btn--primary" href="' + escapeHtml(item.source.url) + '" target="_blank" rel="noopener">' +
          'Ler na fonte original' +
          '<svg class="icon" aria-hidden="true"><use href="#i-external"></use></svg>' +
        '</a>' +
        '<p class="note">Fonte: ' + escapeHtml(item.source.label) + '. O link abre em uma nova aba.</p>' +
      '</div>';

    newsDialog.setAttribute('aria-labelledby', 'newsTitle');
    openDialog(newsDialog, lastNewsOpener);
    var closeButton = $('[data-close-dialog]', newsDialog);
    window.setTimeout(function () { focusIfPossible(closeButton); }, 40);
  }

  if (newsGrid) {
    renderNews();

    on(newsFilters, 'click', function (event) {
      var button = event.target.closest('[data-filter]');
      if (!button) return;
      activeFilter = button.getAttribute('data-filter') || 'all';
      $$('[data-filter]', newsFilters).forEach(function (filterButton) {
        var active = filterButton === button;
        filterButton.classList.toggle('is-active', active);
        filterButton.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      renderNews();
    });

    on(newsGrid, 'click', function (event) {
      var button = event.target.closest('[data-news]');
      if (button) openNews(button.getAttribute('data-news'), button);
    });
  }

  on(newsDialog, 'close', function () {
    focusIfPossible(lastNewsOpener);
  });

  /* ------------------------------------------------------------------------
     6. Diálogos e ajuda
     ------------------------------------------------------------------------ */

  var helpDialog = $('#helpDialog');
  var a11yDialog = $('#a11yDialog');
  var mailDialog = $('#mailDialog');

  var dialogMap = {
    help: helpDialog,
    accessibility: a11yDialog,
    mail: mailDialog
  };

  $$('dialog').forEach(function (dialog) {
    on(dialog, 'click', function (event) {
      if (event.target === dialog) dialog.close();
    });
    on(dialog, 'close', function () {
      var opener = dialogOpeners.get(dialog);
      if (opener) focusIfPossible(opener);
      dialogOpeners.delete(dialog);
    });
  });

  on(document, 'click', function (event) {
    var openButton = event.target.closest('[data-open]');
    if (openButton) {
      event.preventDefault();
      var name = openButton.getAttribute('data-open');
      openDialog(dialogMap[name], openButton);
      if (name === 'accessibility') syncPreferenceControls();
      return;
    }

    var closeButton = event.target.closest('[data-close-dialog]');
    if (closeButton) {
      var dialog = closeButton.closest('dialog');
      if (dialog) closeDialog(dialog);
      return;
    }

    var tourButton = event.target.closest('[data-tour-start]');
    if (tourButton) {
      event.preventDefault();
      $$('dialog[open]').forEach(function (dialog) { dialog.close(); });
      startTour();
      return;
    }

    var copyButton = event.target.closest('[data-copy-target]');
    if (copyButton) {
      event.preventDefault();
      var target = document.getElementById(copyButton.getAttribute('data-copy-target'));
      if (!target) return;
      var text = ('value' in target && target.value) ? target.value : target.innerText;
      copyText(text.trim(), copyButton);
      return;
    }

    var shareButton = event.target.closest('[data-share]');
    if (shareButton) {
      event.preventDefault();
      sharePage();
      return;
    }

    var readButton = event.target.closest('[data-read-summary]');
    if (readButton) {
      event.preventDefault();
      readSummary();
    }
  });

  /* Perguntas frequentes */
  var faqToggle = $('#faqToggle');
  var faqItems = $$('.faq__item');

  function syncFaqToggle() {
    if (!faqToggle || !faqItems.length) return;
    var anyClosed = faqItems.some(function (item) { return !item.open; });
    faqToggle.textContent = anyClosed ? 'Abrir todas' : 'Fechar todas';
    faqToggle.setAttribute('aria-expanded', anyClosed ? 'false' : 'true');
  }

  on(faqToggle, 'click', function () {
    var shouldOpen = faqItems.some(function (item) { return !item.open; });
    faqItems.forEach(function (item) {
      item.open = shouldOpen;
    });
    syncFaqToggle();
  });

  faqItems.forEach(function (item) {
    on(item, 'toggle', syncFaqToggle);
  });
  syncFaqToggle();

  /* ------------------------------------------------------------------------
     7. Preferências de acessibilidade e leitura em voz alta
     ------------------------------------------------------------------------ */

  var PREF_KEY = 'ammg-prefs';
  var storedPrefs = readStorage(PREF_KEY, {});

  var prefs = {
    font: Number(storedPrefs.font || root.getAttribute('data-font') || 1),
    contrast: storedPrefs.contrast === 'high' || root.getAttribute('data-contrast') === 'high' ? 'high' : 'normal',
    easyread: storedPrefs.easyread === true || root.getAttribute('data-easyread') === 'on',
    motion: storedPrefs.motion !== false && root.getAttribute('data-motion') !== 'off'
  };

  if (storedPrefs.motion === undefined && prefersReducedMotion()) {
    prefs.motion = false;
  }

  function applyPreferences(persist) {
    if (prefs.font < 1 || prefs.font > 3) prefs.font = 1;
    root.setAttribute('data-font', String(prefs.font));
    root.setAttribute('data-contrast', prefs.contrast);
    root.setAttribute('data-easyread', prefs.easyread ? 'on' : 'off');
    root.setAttribute('data-motion', prefs.motion ? 'on' : 'off');

    var themeMeta = $('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', prefs.contrast === 'high' ? '#000000' : '#2A1710');

    if (persist) writeStorage(PREF_KEY, prefs);
    syncPreferenceControls();
  }

  function syncPreferenceControls() {
    $$('[data-font-size]').forEach(function (button) {
      button.setAttribute('aria-pressed', Number(button.getAttribute('data-font-size')) === prefs.font ? 'true' : 'false');
    });

    var contrastToggle = $('#contrastToggle');
    if (contrastToggle) contrastToggle.checked = prefs.contrast === 'high';

    var easyReadToggle = $('#easyReadToggle');
    if (easyReadToggle) easyReadToggle.checked = prefs.easyread;

    var motionToggle = $('#motionToggle');
    if (motionToggle) motionToggle.checked = prefs.motion;
  }

  $$('[data-font-size]').forEach(function (button) {
    on(button, 'click', function () {
      prefs.font = Number(button.getAttribute('data-font-size')) || 1;
      applyPreferences(true);
      showToast('Tamanho das letras atualizado.');
    });
  });

  on($('#contrastToggle'), 'change', function (event) {
    prefs.contrast = event.target.checked ? 'high' : 'normal';
    applyPreferences(true);
    showToast(prefs.contrast === 'high' ? 'Alto contraste ativado.' : 'Contraste normal restaurado.');
  });

  on($('#easyReadToggle'), 'change', function (event) {
    prefs.easyread = event.target.checked;
    applyPreferences(true);
    showToast(prefs.easyread ? 'Leitura fácil ativada.' : 'Leitura fácil desativada.');
  });

  on($('#motionToggle'), 'change', function (event) {
    prefs.motion = event.target.checked;
    applyPreferences(true);
    if (prefs.motion) {
      $$('.reveal').forEach(function (element) { element.classList.add('is-visible'); });
    }
    showToast(prefs.motion ? 'Animações ligadas.' : 'Animações desligadas.');
  });

  on($('#resetPrefs'), 'click', function () {
    prefs = {
      font: 1,
      contrast: 'normal',
      easyread: false,
      motion: !prefersReducedMotion()
    };
    applyPreferences(true);
    showToast('Preferências restauradas.');
  });

  applyPreferences(false);

  /* Leitura em voz alta */
  var synth = window.speechSynthesis;
  var readButton = $('#readSummaryBtn');
  var stopButton = $('#stopReadBtn');
  var speechNote = $('#speechNote');
  var speechChunks = [];
  var speechIndex = 0;
  var speechRunning = false;

  if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') {
    if (speechNote) speechNote.textContent = 'Seu navegador não oferece leitura em voz alta. Você pode usar o leitor de tela do seu aparelho.';
    if (readButton) readButton.disabled = true;
    $$('[data-read-summary]').forEach(function (button) { button.disabled = true; });
  }

  function splitSpeech(text) {
    var sentences = String(text).match(/[^.!?]+[.!?]*/g) || [String(text)];
    var chunks = [];
    var current = '';
    sentences.forEach(function (sentence) {
      var clean = sentence.trim();
      if (!clean) return;
      if ((current + ' ' + clean).trim().length > 170 && current) {
        chunks.push(current.trim());
        current = clean;
      } else {
        current = (current + ' ' + clean).trim();
      }
    });
    if (current) chunks.push(current.trim());
    return chunks;
  }

  function setSpeechUi(running) {
    speechRunning = running;
    if (stopButton) stopButton.hidden = !running;
    if (readButton) readButton.disabled = running;
    $$('[data-read-summary]').forEach(function (button) {
      button.disabled = running;
    });
  }

  function stopSpeech(silent) {
    if (synth) synth.cancel();
    speechChunks = [];
    speechIndex = 0;
    setSpeechUi(false);
    if (!silent) showToast('Leitura parada.');
  }

  function speakNextChunk() {
    if (!synth || speechIndex >= speechChunks.length) {
      setSpeechUi(false);
      return;
    }

    var utterance = new window.SpeechSynthesisUtterance(speechChunks[speechIndex]);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    var voices = synth.getVoices ? synth.getVoices() : [];
    var voice = voices.filter(function (item) { return item.lang === 'pt-BR'; })[0] ||
      voices.filter(function (item) { return /^pt/i.test(item.lang); })[0];
    if (voice) utterance.voice = voice;

    utterance.onend = function () {
      speechIndex += 1;
      speakNextChunk();
    };
    utterance.onerror = function (event) {
      if (event.error === 'canceled' || event.error === 'interrupted') return;
      setSpeechUi(false);
      if (speechNote) speechNote.textContent = 'A leitura foi interrompida pelo navegador. Tente novamente ou use o leitor de tela do seu aparelho.';
      showToast('Não foi possível concluir a leitura.');
    };

    synth.speak(utterance);
  }

  function readSummary() {
    if (!synth) {
      showToast('Seu navegador não oferece leitura em voz alta.');
      return;
    }

    stopSpeech(true);
    var text = CONFIG.speechSummary || 'Associação de Mulheres Maria da Glória. Cozinha comunitária no Morro da Cruz, em Porto Alegre.';
    speechChunks = splitSpeech(text);
    speechIndex = 0;
    setSpeechUi(true);
    if (speechNote) speechNote.textContent = 'A leitura está em andamento. Você pode parar quando quiser.';
    speakNextChunk();
  }

  on(readButton, 'click', readSummary);
  on(stopButton, 'click', function () { stopSpeech(false); });

  on(window, 'pagehide', function () {
    if (synth) synth.cancel();
  });

  /* ------------------------------------------------------------------------
     8. Passeio guiado
     ------------------------------------------------------------------------ */

  var tour = $('#tour');
  var tourCard = $('#tourCard');
  var tourSpotlight = $('#tourSpotlight');
  var tourTitle = $('#tourTitle');
  var tourText = $('#tourText');
  var tourStep = $('#tourStep');
  var tourDots = $('#tourDots');
  var tourPrev = $('#tourPrev');
  var tourNext = $('#tourNext');
  var tourClose = $('#tourClose');
  var tourSteps = Array.isArray(DATA.tour) ? DATA.tour.slice() : [];
  var tourIndex = 0;
  var tourActive = false;
  var tourReturnFocus = null;
  var tourUpdateTimer = null;

  function tourTargets() {
    return tourSteps
      .map(function (step, index) {
        return { step: step, index: index, element: $(step.selector) };
      })
      .filter(function (item) { return Boolean(item.element); });
  }

  function buildTourDots() {
    if (!tourDots) return;
    var targets = tourTargets();
    tourDots.innerHTML = targets.map(function (item, index) {
      return '<button class="tour__dot" type="button" data-tour-dot="' + index + '"' +
        ' aria-label="Ir para o passo ' + (index + 1) + ': ' + escapeHtml(item.step.title) + '"></button>';
    }).join('');
  }

  function updateTourSpotlight() {
    if (!tourActive || !tourSpotlight) return;
    var targets = tourTargets();
    var item = targets[tourIndex];
    if (!item) return;

    var rect = item.element.getBoundingClientRect();
    var pad = 10;
    var viewportH = window.innerHeight;
    var top = Math.max(8, rect.top - pad);
    var height = Math.min(rect.height + pad * 2, viewportH - 16);

    if (rect.height > viewportH * 0.72) {
      height = Math.min(viewportH * 0.55, rect.height + pad * 2);
      top = Math.max(8, Math.min(rect.top - pad, viewportH * 0.16));
    }

    var left = Math.max(8, rect.left - pad);
    var width = Math.min(rect.width + pad * 2, window.innerWidth - 16);

    tourSpotlight.style.top = top + 'px';
    tourSpotlight.style.left = left + 'px';
    tourSpotlight.style.width = width + 'px';
    tourSpotlight.style.height = height + 'px';

    if (tourCard) {
      var cardIsTop = rect.top > viewportH * 0.5;
      tourCard.classList.toggle('tour__card--top', cardIsTop);
    }
  }

  function scheduleTourUpdate() {
    window.clearTimeout(tourUpdateTimer);
    tourUpdateTimer = window.setTimeout(updateTourSpotlight, 60);
  }

  function showTourStep(index) {
    var targets = tourTargets();
    if (!targets.length) return;
    if (index < 0) index = 0;
    if (index >= targets.length) {
      closeTour(true);
      return;
    }

    tourIndex = index;
    var item = targets[index];

    if (tourTitle) tourTitle.textContent = item.step.title;
    if (tourText) tourText.textContent = item.step.text;
    if (tourStep) tourStep.textContent = 'Passo ' + (index + 1) + ' de ' + targets.length;
    if (tourPrev) tourPrev.disabled = index === 0;
    if (tourNext) tourNext.textContent = index === targets.length - 1 ? 'Concluir' : 'Próximo';

    $$('.tour__dot', tourDots).forEach(function (dot, dotIndex) {
      var active = dotIndex === index;
      dot.classList.toggle('is-active', active);
      if (active) {
        dot.setAttribute('aria-current', 'step');
      } else {
        dot.removeAttribute('aria-current');
      }
    });

    var rect = item.element.getBoundingClientRect();
    var headerHeight = header ? header.offsetHeight : 0;
    var fullyVisible = rect.top >= headerHeight + 12 && rect.bottom <= window.innerHeight - 12;

    if (!fullyVisible) {
      try {
        item.element.scrollIntoView({ behavior: motionEnabled() ? 'smooth' : 'auto', block: 'center' });
      } catch (error) {
        item.element.scrollIntoView();
      }
    }

    updateTourSpotlight();
    window.setTimeout(updateTourSpotlight, motionEnabled() ? 380 : 30);
    window.setTimeout(updateTourSpotlight, motionEnabled() ? 720 : 60);

    if (tourCard) focusIfPossible(tourCard);
  }

  function startTour() {
    if (tourActive) return;
    if (FEATURES.tour === false) {
      showToast('O passeio guiado está indisponível no momento.');
      return;
    }
    if (!tour || !tourCard || !tourTargets().length) {
      showToast('O passeio guiado não pôde ser aberto.');
      return;
    }

    stopSpeech(true);
    tourReturnFocus = document.activeElement;
    tourActive = true;
    tour.hidden = false;
    document.body.classList.add('tour-open');
    buildTourDots();

    ['#conteudo', '.site-header', '.site-footer', '.proposal-bar', '.fab-stack', '.progress'].forEach(function (selector) {
      var element = $(selector);
      if (element && 'inert' in element) element.inert = true;
    });

    showTourStep(0);
    on(document, 'keydown', onTourKeydown);
    on(window, 'resize', scheduleTourUpdate);
    on(window, 'scroll', scheduleTourUpdate, { passive: true });
  }

  function closeTour(finished) {
    if (!tourActive) return;
    tourActive = false;
    if (tour) tour.hidden = true;
    document.body.classList.remove('tour-open');

    ['#conteudo', '.site-header', '.site-footer', '.proposal-bar', '.fab-stack', '.progress'].forEach(function (selector) {
      var element = $(selector);
      if (element && 'inert' in element) element.inert = false;
    });

    document.removeEventListener('keydown', onTourKeydown);
    window.removeEventListener('resize', scheduleTourUpdate);
    window.removeEventListener('scroll', scheduleTourUpdate);
    window.clearTimeout(tourUpdateTimer);

    focusIfPossible(tourReturnFocus);
    if (finished) showToast('Passeio concluído. Obrigado por conhecer o site!');
  }

  function onTourKeydown(event) {
    if (!tourActive) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeTour(false);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showTourStep(tourIndex + 1);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showTourStep(tourIndex - 1);
      return;
    }

    if (event.key === 'Tab' && tourCard) {
      var focusable = $$('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])', tourCard);
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  on(tourPrev, 'click', function () { showTourStep(tourIndex - 1); });
  on(tourNext, 'click', function () { showTourStep(tourIndex + 1); });
  on(tourClose, 'click', function () { closeTour(false); });

  on(tourDots, 'click', function (event) {
    var dot = event.target.closest('[data-tour-dot]');
    if (!dot) return;
    showTourStep(Number(dot.getAttribute('data-tour-dot')));
  });

  /* ------------------------------------------------------------------------
     9. Formulários, cópia e compartilhamento
     ------------------------------------------------------------------------ */

  var fieldLabels = {
    nome: 'Nome',
    email: 'E-mail',
    telefone: 'Telefone',
    ajuda: 'Como posso ajudar',
    disponibilidade: 'Disponibilidade',
    mensagem: 'Mensagem',
    assunto: 'Assunto'
  };

  function buildMailBody(form) {
    var formData = new window.FormData(form);
    var lines = [];

    formData.forEach(function (value, key) {
      if (key === 'consentimento') return;
      var text = String(value).trim();
      if (!text) return;
      lines.push((fieldLabels[key] || key) + ': ' + text);
    });

    lines.push('');
    lines.push('— Mensagem preparada no site da Associação de Mulheres Maria da Glória.');
    lines.push('Este site é uma prévia e ainda não é o canal oficial da associação.');
    return lines.join('\n');
  }

  function prepareMail(form) {
    var body = buildMailBody(form);
    var subject = form.getAttribute('data-subject') || 'Contato pelo site — Maria da Glória';
    var mailto = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    var mailText = $('#mailText');
    var mailOpenLink = $('#mailOpenLink');
    if (mailText) mailText.value = body;
    if (mailOpenLink) mailOpenLink.setAttribute('href', mailto);

    openDialog(mailDialog, form.querySelector('[type="submit"]') || form);
    window.setTimeout(function () {
      if (mailText) {
        focusIfPossible(mailText);
        try { mailText.select(); } catch (error) { /* seleção opcional */ }
      }
    }, 80);
  }

  $$('form[data-mail-form]').forEach(function (form) {
    on(form, 'submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      prepareMail(form);
    });
  });

  function copyText(text, sourceButton) {
    if (!text) {
      showToast('Não há texto para copiar.');
      return;
    }

    function done() {
      showToast('Copiado! Agora você pode colar onde quiser.');
      if (sourceButton) {
        sourceButton.classList.add('is-copied');
        window.setTimeout(function () { sourceButton.classList.remove('is-copied'); }, 1200);
      }
    }

    function fallbackCopy() {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', 'readonly');
      area.style.position = 'fixed';
      area.style.top = '-1000px';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (error) { ok = false; }
      document.body.removeChild(area);
      if (ok) done();
      else showToast('Não foi possível copiar. Selecione o texto e copie com o teclado.');
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  function sharePage() {
    var shareData = {
      title: document.title,
      text: 'Conheça a Associação de Mulheres Maria da Glória, cozinha comunitária no Morro da Cruz.',
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(function (error) {
        if (error && error.name === 'AbortError') return;
        copyText(window.location.href);
      });
    } else {
      copyText(window.location.href);
    }
  }

  /* Atalho: fecha diálogos com Escape mesmo em navegadores sem <dialog> nativo. */
  on(document, 'keydown', function (event) {
    if (event.key !== 'Escape') return;
    $$('dialog[open]').forEach(function (dialog) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    });
  });

  /* Fim */
})();
