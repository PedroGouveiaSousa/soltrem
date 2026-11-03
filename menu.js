(() => {
  const viewer = document.createElement('dialog');
  if (typeof viewer.showModal !== 'function') return;

  viewer.className = 'menu-viewer';
  viewer.setAttribute('aria-labelledby', 'menu-viewer-title');
  viewer.innerHTML = `
    <header class="menu-viewer-header">
      <h2 id="menu-viewer-title"></h2>
      <button type="button" class="menu-viewer-close" autofocus>Fechar <span aria-hidden="true">×</span></button>
    </header>
    <div class="menu-viewer-toolbar" aria-label="Ampliação do menu">
      <a class="menu-viewer-switch" data-menu></a>
      <div class="menu-viewer-controls">
        <button type="button" data-zoom="out" aria-label="Diminuir menu">−</button>
        <button type="button" data-zoom="reset" aria-label="Voltar ao tamanho inicial" title="Ajustar à largura">100%</button>
        <button type="button" data-zoom="in" aria-label="Ampliar menu">+</button>
      </div>
    </div>
    <div class="menu-viewer-stage" role="region" aria-label="Imagem do menu" tabindex="0">
      <img class="menu-viewer-image" alt="">
      <p class="menu-viewer-error" hidden>Não foi possível carregar o menu. <a>Abrir a imagem</a></p>
    </div>`;
  document.body.append(viewer);

  const title = viewer.querySelector('h2');
  const closeButton = viewer.querySelector('.menu-viewer-close');
  const stage = viewer.querySelector('.menu-viewer-stage');
  const image = viewer.querySelector('.menu-viewer-image');
  const errorMessage = viewer.querySelector('.menu-viewer-error');
  const imageLink = errorMessage.querySelector('a');
  const switchLink = viewer.querySelector('.menu-viewer-switch');
  const zoomOut = viewer.querySelector('[data-zoom="out"]');
  const zoomReset = viewer.querySelector('[data-zoom="reset"]');
  const zoomIn = viewer.querySelector('[data-zoom="in"]');
  const minZoom = 100;
  const maxZoom = 400;
  const zoomStep = 20;
  let zoom = minZoom;
  let trigger;

  function setZoom(level, keepPosition = true) {
    const next = Math.min(Math.max(level, minZoom), maxZoom);
    if (keepPosition && next === zoom) return;

    const width = image.offsetWidth;
    const height = image.offsetHeight;
    const centerX = (stage.scrollLeft + stage.clientWidth / 2) / (width || 1);
    const centerY = (stage.scrollTop + Math.min(stage.clientHeight, height) / 2) / (height || 1);

    zoom = next;
    image.style.setProperty('--menu-viewer-width', `${zoom}%`);
    zoomReset.textContent = `${zoom}%`;
    zoomReset.setAttribute('aria-label', `${zoom}%. Ajustar à largura`);
    zoomOut.setAttribute('aria-disabled', String(zoom === minZoom));
    zoomIn.setAttribute('aria-disabled', String(zoom === maxZoom));

    stage.scrollLeft = keepPosition ? centerX * image.offsetWidth - stage.clientWidth / 2 : 0;
    stage.scrollTop = keepPosition ? centerY * image.offsetHeight - stage.clientHeight / 2 : 0;
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-menu][href]');
    if (!link || (viewer.open && link !== switchLink) || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;

    const menu = link.dataset.menu;
    const source = link.dataset.menuImage || link.href;
    const nextMenu = menu === 'Comidas' ? 'Bebidas' : 'Comidas';
    const nextSlug = nextMenu.toLowerCase();

    if (!viewer.open) trigger = link;
    title.textContent = menu;
    image.alt = `Menu de ${menu.toLocaleLowerCase('pt-PT')} do SOLTREM`;
    imageLink.href = source;
    switchLink.href = `${nextSlug}.html`;
    switchLink.dataset.menu = nextMenu;
    switchLink.dataset.menuImage = `assets/${nextSlug}.png`;
    switchLink.textContent = `Ver ${nextMenu} →`;
    errorMessage.hidden = true;
    image.hidden = false;
    image.src = source;
    if (!viewer.open) viewer.showModal();
    else closeButton.focus({ preventScroll: true });
    setZoom(minZoom, false);
    event.preventDefault();
  });

  closeButton.addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => {
    image.removeAttribute('src');
    trigger?.focus({ preventScroll: true });
  });

  image.addEventListener('error', () => {
    if (!viewer.open) return;
    image.hidden = true;
    errorMessage.hidden = false;
  });

  zoomOut.addEventListener('click', () => setZoom(zoom - zoomStep));
  zoomReset.addEventListener('click', () => setZoom(minZoom, false));
  zoomIn.addEventListener('click', () => setZoom(zoom + zoomStep));

  viewer.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      setZoom(zoom + zoomStep);
    } else if (event.key === '-') {
      event.preventDefault();
      setZoom(zoom - zoomStep);
    }
  });
})();
