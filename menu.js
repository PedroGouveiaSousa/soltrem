const zoomButton = document.getElementById('menu-zoom');
const menu = document.getElementById('menu-image');
const zoomHint = document.getElementById('menu-zoom-hint');
const menuImage = menu.querySelector('img');

menu.style.setProperty('--original-width', menuImage.getAttribute('width') + 'px');
zoomButton.hidden = false;

zoomButton.addEventListener('click', () => {
  const zoomed = menu.classList.toggle('is-zoomed');
  zoomButton.setAttribute('aria-pressed', String(zoomed));
  zoomHint.hidden = !zoomed;

  if (zoomed) {
    menu.tabIndex = 0;
    menu.setAttribute('aria-describedby', zoomHint.id);
  } else {
    menu.removeAttribute('tabindex');
    menu.removeAttribute('aria-describedby');
    menu.scrollLeft = 0;
  }
});
