function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
  return Promise.resolve();
}

function showTemporaryLabel(button, label) {
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => { button.textContent = original; }, 1600);
}

const search = document.querySelector('#search');
const family = document.querySelector('#family-filter');
const source = document.querySelector('#source-filter');
const cards = [...document.querySelectorAll('.asset-card')];
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty-state');

if (search && family && source && count && empty) {
  function filterCards() {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    for (const card of cards) {
      const matches = (!query || card.dataset.search.includes(query)) &&
        (!family.value || card.dataset.family === family.value) &&
        (!source.value || card.dataset.source === source.value);
      card.hidden = !matches;
      if (matches) visible += 1;
    }
    count.textContent = `${visible} asset${visible === 1 ? '' : 's'}`;
    empty.hidden = visible !== 0;
  }

  for (const input of [search, family, source]) input.addEventListener('input', filterCards);
}

async function readSvg(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

for (const sourceBlock of document.querySelectorAll('[data-svg-source]')) {
  readSvg(sourceBlock.dataset.svgPath)
    .then((svg) => { sourceBlock.textContent = svg.trim(); })
    .catch((error) => {
      console.error(error);
      sourceBlock.textContent = 'Unable to load the SVG source.';
    });
}

for (const button of document.querySelectorAll('.js-copy-svg')) {
  button.addEventListener('click', async () => {
    try {
      await copyText(await readSvg(button.dataset.svgPath));
      showTemporaryLabel(button, 'Copied');
    } catch (error) {
      console.error(error);
      showTemporaryLabel(button, 'Copy failed');
    }
  });
}

for (const button of document.querySelectorAll('.js-copy-code')) {
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;
    try {
      await copyText(target.textContent);
      showTemporaryLabel(button, 'Copied');
    } catch (error) {
      console.error(error);
      showTemporaryLabel(button, 'Copy failed');
    }
  });
}

for (const preview of document.querySelectorAll('[data-asset-preview]')) {
  const stage = preview.querySelector('[data-preview-stage]');
  const icon = preview.querySelector('[data-preview-icon]');
  const background = preview.querySelector('[data-preview-background]');
  const colour = preview.querySelector('[data-preview-color]');
  const size = preview.querySelector('[data-preview-size]');
  const canvas = preview.querySelector('[data-preview-canvas]');

  function updatePreview() {
    stage.className = `preview-stage preview-stage--${background.value}`;
    stage.classList.toggle('preview-stage--show-canvas', canvas.checked);
    icon.style.color = colour.value;
    icon.setAttribute('width', size.value);
    icon.setAttribute('height', size.value);
    stage.style.setProperty('--preview-size', `${size.value}px`);
  }

  for (const control of [background, colour, size, canvas]) control.addEventListener('input', updatePreview);
  updatePreview();
}
