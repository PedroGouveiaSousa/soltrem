/* SOLTREM v5 — menu viewer for touch screens. No dependencies; links work without JS. */
(() => {
  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;

  const menus = {
    comidas: { title: 'Comidas', image: 'assets/comidas.jpg' },
    bebidas: { title: 'Bebidas', image: 'assets/bebidas.jpg' },
  };

  const dialog = document.createElement('dialog');
  dialog.className = 'menu-viewer';
  dialog.setAttribute('aria-labelledby', 'viewer-title');
  dialog.innerHTML = `
    <header class="viewer-top">
      <div class="viewer-brand"><small>SOLTREM · A NOSSA CARTA</small><h2 id="viewer-title">Comidas</h2></div>
      <button class="viewer-close" type="button" aria-label="Fechar menu">Fechar <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    </header>
    <nav class="viewer-tabs" aria-label="Alternar entre menus">
      <button class="viewer-tab" type="button" data-view="comidas" aria-pressed="true">Comidas</button>
      <button class="viewer-tab" type="button" data-view="bebidas" aria-pressed="false">Bebidas</button>
    </nav>
    <div class="viewer-canvas" role="region" aria-label="Menu com zoom e deslocação" tabindex="0">
      <p class="viewer-loading" role="status">A carregar menu…</p>
      <img alt="" draggable="false" hidden>
      <p class="viewer-error" hidden>Não foi possível carregar a imagem do menu. <a href="">Abrir a imagem diretamente</a></p>
    </div>
    <footer class="viewer-bottom">
      <div class="viewer-tip"><span>Usa dois dedos para ampliar</span><a class="viewer-original" href="" target="_blank" rel="noopener noreferrer">Abrir imagem ↗</a></div>
      <div class="viewer-zoom" role="group" aria-label="Ampliação">
        <button type="button" data-action="out" aria-label="Diminuir zoom">−</button>
        <button type="button" data-action="reset" aria-label="Repor zoom">100%</button>
        <button type="button" data-action="in" aria-label="Aumentar zoom">+</button>
      </div>
    </footer>`;
  document.body.append(dialog);

  const select = (sel) => dialog.querySelector(sel);
  const canvas = select('.viewer-canvas');
  const image = select('.viewer-canvas img');
  const loading = select('.viewer-loading');
  const error = select('.viewer-error');
  const reset = select('[data-action="reset"]');
  const zoomIn = select('[data-action="in"]');
  const zoomOut = select('[data-action="out"]');
  const originals = [select('.viewer-original'), select('.viewer-error a')];
  const close = select('.viewer-close');
  const tabs = Array.from(dialog.querySelectorAll('[data-view]'));

  let zoom = 100;
  let startingFingerGap = 0;
  let startingZoom = 100;
  let lastTrigger = null;
  let activeMenu = 'comidas';

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const distance = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  function setZoom(value, focusX, focusY) {
    const rect = canvas.getBoundingClientRect();
    const localX = focusX === undefined ? rect.width / 2 : focusX - rect.left;
    const localY = focusY === undefined ? rect.height / 2 : focusY - rect.top;
    const prevWidth = image.offsetWidth || rect.width || 1;
    const prevHeight = image.offsetHeight || rect.height || 1;
    const imageX = (canvas.scrollLeft + localX) / prevWidth;
    const imageY = (canvas.scrollTop + localY) / prevHeight;
    zoom = Math.round(clamp(value, 100, 450));
    image.style.setProperty('--image-scale', `${zoom}%`);
    reset.textContent = `${zoom}%`;
    zoomOut.disabled = zoom <= 100;
    zoomIn.disabled = zoom >= 450;
    canvas.scrollLeft = imageX * image.offsetWidth - localX;
    canvas.scrollTop = imageY * image.offsetHeight - localY;
  }

  function showMenu(key, opener) {
    const menu = menus[key];
    if (!menu) return;
    if (!dialog.open) {
      lastTrigger = opener || document.activeElement;
      dialog.showModal();
    }
    activeMenu = key;
    select('#viewer-title').textContent = menu.title;
    tabs.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.view === key)));
    originals.forEach((link) => { link.href = menu.image; });
    loading.hidden = false;
    error.hidden = true;
    image.hidden = true;
    image.alt = `Tabela de preços de ${menu.title.toLowerCase()} do SOLTREM`;
    image.removeAttribute('src');
    image.src = menu.image;
    zoom = 100;
    image.style.setProperty('--image-scale', '100%');
    reset.textContent = '100%';
    zoomOut.disabled = true;
    zoomIn.disabled = false;
    canvas.scrollLeft = 0;
    canvas.scrollTop = 0;
    startingFingerGap = 0;
    close.focus({ preventScroll: true });
  }

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[data-menu]');
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (!menus[anchor.dataset.menu]) return;
    event.preventDefault();
    showMenu(anchor.dataset.menu, anchor);
  });

  image.addEventListener('load', () => {
    loading.hidden = true;
    error.hidden = true;
    image.hidden = false;
  });
  image.addEventListener('error', () => {
    loading.hidden = true;
    image.hidden = true;
    error.hidden = false;
  });
  tabs.forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.view !== activeMenu) showMenu(button.dataset.view);
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    lastTrigger?.focus?.({ preventScroll: true });
    lastTrigger = null;
  });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  zoomOut.addEventListener('click', () => setZoom(zoom - 25));
  zoomIn.addEventListener('click', () => setZoom(zoom + 25));
  reset.addEventListener('click', () => { setZoom(100); canvas.scrollLeft = 0; canvas.scrollTop = 0; });
  canvas.addEventListener('dblclick', (event) => setZoom(zoom === 100 ? 220 : 100, event.clientX, event.clientY));

  canvas.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 2) return;
    startingFingerGap = distance(event.touches[0], event.touches[1]);
    startingZoom = zoom;
  }, { passive: true });

  canvas.addEventListener('touchmove', (event) => {
    if (event.touches.length !== 2 || !startingFingerGap) return;
    event.preventDefault();
    const x = (event.touches[0].clientX + event.touches[1].clientX) / 2;
    const y = (event.touches[0].clientY + event.touches[1].clientY) / 2;
    setZoom(startingZoom * distance(event.touches[0], event.touches[1]) / startingFingerGap, x, y);
  }, { passive: false });
  canvas.addEventListener('touchend', (event) => { if (event.touches.length < 2) startingFingerGap = 0; }, { passive: true });
  canvas.addEventListener('touchcancel', () => { startingFingerGap = 0; }, { passive: true });

  dialog.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(zoom + 25); }
    if (event.key === '-') { event.preventDefault(); setZoom(zoom - 25); }
  });
})();
