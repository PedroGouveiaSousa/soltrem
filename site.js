/* SOLTREM — Copy-to-clipboard and QR dialog, no external dependencies. */
(() => {
  const toast = document.querySelector('#toast');
  let toastTimeout;
  const notify = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.hidden = true; }, 2600);
  };

  const copy = async (value) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch (_) { /* fallback for file:// */ }
    const field = document.createElement('textarea');
    field.value = value;
    field.readOnly = true;
    field.style.cssText = 'position:fixed;left:-9999px;opacity:0;';
    document.body.append(field);
    field.focus();
    field.select();
    let success = false;
    try { success = document.execCommand('copy'); } catch (_) { /* unsupported */ }
    field.remove();
    return success;
  };

  document.querySelectorAll('[data-copy]').forEach((button) => {
    const span = button.querySelector('span');
    const original = span ? span.textContent : button.textContent;
    let resetTimeout;
    button.addEventListener('click', async () => {
      const worked = await copy(button.dataset.copy);
      if (span) span.textContent = worked ? 'Copiado ✓' : original;
      else button.textContent = worked ? 'Copiado ✓' : original;
      notify(worked ? `${button.dataset.label || 'Número'} copiado!` : `Copia manualmente: ${button.dataset.copy}`);
      clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => { if (span) span.textContent = original; else button.textContent = original; }, 2400);
    });
  });

  const dialog = document.querySelector('#qr-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    let previousFocus = null;
    document.querySelectorAll('[data-qr-open]').forEach((button) => button.addEventListener('click', () => {
      previousFocus = button;
      if (!dialog.open) dialog.showModal();
      dialog.querySelector('[data-qr-close]')?.focus();
    }));
    dialog.querySelector('[data-qr-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => previousFocus?.focus?.());
  } else {
    document.querySelectorAll('[data-qr-open]').forEach((button) => button.addEventListener('click', () => {
      window.open('assets/revolut-qr.png', '_blank', 'noopener');
    }));
  }
})();
