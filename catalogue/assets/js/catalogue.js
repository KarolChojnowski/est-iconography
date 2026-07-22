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

const previewBackgroundClasses = ['bg-white', 'bg-dark', 'bg-body-secondary'];

for (const preview of document.querySelectorAll('[data-asset-preview]')) {
  const stage = preview.querySelector('[data-preview-stage]');
  const icon = preview.querySelector('[data-preview-icon]');
  const background = preview.querySelector('[data-preview-background]');
  const colour = preview.querySelector('[data-preview-color]');
  const size = preview.querySelector('[data-preview-size]');
  const canvas = preview.querySelector('[data-preview-canvas]');

  function updatePreview() {
    stage.classList.remove(...previewBackgroundClasses);
    stage.classList.add(background.value);
    icon.style.color = colour.value;
    icon.setAttribute('width', size.value);
    icon.setAttribute('height', size.value);
    icon.style.outline = canvas.checked ? '1px dashed var(--bs-danger)' : 'none';
  }

  for (const control of [background, colour, size, canvas]) control.addEventListener('input', updatePreview);
  updatePreview();
}

const manifestElement = document.querySelector('#asset-manifest');
const tray = document.querySelector('[data-selection-tray]');
const launcher = document.querySelector('[data-selection-launcher]');
const selectionCounts = [...document.querySelectorAll('[data-selection-count]')];
const selectionList = document.querySelector('[data-selection-list]');
const selectionStatus = document.querySelector('[data-selection-status]');
const bundleOutput = document.querySelector('[data-bundle-output]');
const bundleCommandBlocks = [...document.querySelectorAll('[data-bundle-command]')];
const selectButtons = [...document.querySelectorAll('.js-select-asset')];
const storageKey = 'est-iconography-selected-assets';
let manifest = { libraryVersion: '', assets: [] };

try {
  if (manifestElement) manifest = JSON.parse(manifestElement.textContent);
} catch (error) {
  console.error('Unable to read the catalogue asset manifest.', error);
}

const assetMap = new Map(manifest.assets.map((asset) => [asset.id, asset]));

function readStoredSelection() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(stored)) return [];
    const requested = new Set(stored.filter((id) => typeof id === 'string'));
    return manifest.assets.filter((asset) => requested.has(asset.id)).map((asset) => asset.id);
  } catch {
    return [];
  }
}

const selectedIds = new Set(readStoredSelection());

function orderedSelectedAssets() {
  return manifest.assets.filter((asset) => selectedIds.has(asset.id));
}

function saveSelection() {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(orderedSelectedAssets().map((asset) => asset.id)));
  } catch (error) {
    console.warn('Unable to save the catalogue selection.', error);
  }
}

function shellArgument(value) {
  if (/^[a-zA-Z0-9_./-]+$/.test(value)) return value;
  return `'${value.replaceAll("'", "'\\''")}'`;
}

function createBundleCommand(assets) {
  const output = bundleOutput?.value.trim() || './build/iconography-bundle';
  const lines = [
    'npm run bundle:iconography -- \\',
    `  --out ${shellArgument(output)} \\`
  ];

  assets.forEach((asset, index) => {
    const continuation = index < assets.length - 1 ? ' \\' : '';
    lines.push(`  ${asset.id}${continuation}`);
  });

  return lines.join('\n');
}

function createSelectionDocument(assets) {
  return {
    formatVersion: 1,
    libraryVersion: manifest.libraryVersion,
    assetIds: assets.map((asset) => asset.id)
  };
}

function announce(message) {
  if (selectionStatus) selectionStatus.textContent = message;
}

function renderSelectionList(assets) {
  if (!selectionList) return;
  selectionList.replaceChildren();

  for (const asset of assets) {
    const item = document.createElement('li');
    const details = document.createElement('div');
    const label = document.createElement('strong');
    const id = document.createElement('code');
    const remove = document.createElement('button');

    item.className = 'list-group-item d-flex align-items-start justify-content-between gap-3';
    details.className = 'flex-grow-1';
    label.className = 'd-block';
    id.className = 'd-block small text-break mt-1';
    label.textContent = asset.label;
    id.textContent = asset.id;
    details.append(label, id);

    remove.type = 'button';
    remove.className = 'btn btn-outline-danger btn-sm';
    remove.dataset.removeAsset = asset.id;
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove ${asset.label} from selection`);

    item.append(details, remove);
    selectionList.append(item);
  }
}

function updateSelectionUi() {
  const assets = orderedSelectedAssets();
  const hasSelection = assets.length > 0;

  for (const button of selectButtons) {
    const selected = selectedIds.has(button.dataset.assetId);
    button.setAttribute('aria-pressed', String(selected));
    button.textContent = selected ? 'Selected' : 'Select';
    button.classList.toggle('btn-primary', selected);
    button.classList.toggle('btn-outline-primary', !selected);

    const shell = button.closest('.asset-card')?.querySelector('[data-asset-card-shell]');
    shell?.classList.toggle('border-primary', selected);
    shell?.classList.toggle('border-2', selected);
    shell?.classList.toggle('shadow-sm', selected);
  }

  if (launcher) launcher.hidden = !hasSelection;
  for (const selectionCount of selectionCounts) selectionCount.textContent = String(assets.length);
  renderSelectionList(assets);

  const command = hasSelection ? createBundleCommand(assets) : '';
  for (const block of bundleCommandBlocks) block.textContent = command;

  if (!hasSelection && tray && window.bootstrap?.Offcanvas) {
    window.bootstrap.Offcanvas.getInstance(tray)?.hide();
  }
}

function toggleAsset(id) {
  const asset = assetMap.get(id);
  if (!asset) return;

  if (selectedIds.has(id)) {
    selectedIds.delete(id);
    announce(`${asset.label} removed from the project selection.`);
  } else {
    selectedIds.add(id);
    announce(`${asset.label} added to the project selection.`);
  }

  saveSelection();
  updateSelectionUi();
}

for (const button of selectButtons) {
  button.addEventListener('click', () => toggleAsset(button.dataset.assetId));
}

document.querySelector('[data-clear-selection]')?.addEventListener('click', () => {
  selectedIds.clear();
  saveSelection();
  updateSelectionUi();
  announce('Project selection cleared.');
});

selectionList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-asset]');
  if (button) toggleAsset(button.dataset.removeAsset);
});

bundleOutput?.addEventListener('input', updateSelectionUi);

for (const button of document.querySelectorAll('[data-copy-bundle-command]')) {
  button.addEventListener('click', async () => {
    const assets = orderedSelectedAssets();
    if (assets.length === 0) return;
    try {
      await copyText(createBundleCommand(assets));
      showTemporaryLabel(button, 'Copied');
      announce('Bundle command copied.');
    } catch (error) {
      console.error(error);
      showTemporaryLabel(button, 'Copy failed');
    }
  });
}

document.querySelector('[data-copy-asset-ids]')?.addEventListener('click', async (event) => {
  const assets = orderedSelectedAssets();
  if (assets.length === 0) return;
  try {
    await copyText(assets.map((asset) => asset.id).join('\n'));
    showTemporaryLabel(event.currentTarget, 'Copied');
    announce('Canonical asset IDs copied.');
  } catch (error) {
    console.error(error);
    showTemporaryLabel(event.currentTarget, 'Copy failed');
  }
});

document.querySelector('[data-download-selection]')?.addEventListener('click', () => {
  const assets = orderedSelectedAssets();
  if (assets.length === 0) return;

  const documentContent = `${JSON.stringify(createSelectionDocument(assets), null, 2)}\n`;
  const blob = new Blob([documentContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `est-iconography-selection-v${manifest.libraryVersion}.json`;
  link.click();
  URL.revokeObjectURL(url);
  announce('Selection JSON downloaded.');
});

updateSelectionUi();
