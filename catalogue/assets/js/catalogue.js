const search = document.querySelector('#search');
const family = document.querySelector('#family-filter');
const source = document.querySelector('#source-filter');
const cards = [...document.querySelectorAll('.asset-card')];
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty-state');

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

for (const button of document.querySelectorAll('.js-copy-svg')) {
  button.addEventListener('click', async () => {
    const original = button.textContent;
    try {
      const response = await fetch(button.dataset.svgPath);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await navigator.clipboard.writeText(await response.text());
      button.textContent = 'Copied';
    } catch (error) {
      console.error(error);
      button.textContent = 'Copy failed';
    }
    window.setTimeout(() => { button.textContent = original; }, 1600);
  });
}
