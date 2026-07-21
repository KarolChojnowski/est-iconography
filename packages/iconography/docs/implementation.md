# Implementing EST iconography

Use the generated SVGs or family sprites as product assets. The optional helper stylesheet provides low-specificity sizing and composition utilities without introducing a component framework.

## Recommended setup

Copy a complete release or selected bundle into an application-owned public directory. Keep the directory structure unchanged:

```text
iconography/
├── svg/
├── sprites/
├── styles/
│   └── est-iconography.css
├── manifest/
└── licenses/
```

Load the helper once:

```html
<link rel="stylesheet" href="/assets/iconography/styles/est-iconography.css">
```

The stylesheet is optional. Products may implement the same layout rules in their own design-system styles.

## Base SVG pattern

Use the family sprite and canonical sprite ID:

```html
<svg class="est-icon est-icon--16" aria-hidden="true" focusable="false">
  <use href="/assets/iconography/sprites/est-ui-icons.svg#est-ui-icon-house"></use>
</svg>
```

The asset inherits colour through `currentColor`. Set `color` on the SVG or a containing element rather than editing path fills.

## Sizes

The helper provides explicit utilities:

| Class | Rendered size |
| --- | ---: |
| `est-icon--16` | 16px / 1rem |
| `est-icon--24` | 24px / 1.5rem |
| `est-icon--32` | 32px / 2rem |
| `est-icon--48` | 48px / 3rem |
| `est-icon--64` | 64px / 4rem |

Without a size utility, `.est-icon` uses `1em` and follows the surrounding text size.

For an exceptional size, set the custom property:

```html
<svg class="est-icon" style="--est-icon-size: 2.25rem" aria-hidden="true" focusable="false">
  <use href="/assets/iconography/sprites/est-icons.svg#est-icon-heat-pump"></use>
</svg>
```

Review UI icons at 16px before scaling them up. Review Icons at their normal 48px display size before using a compact variant.

## Beside text

Use the composition helper when an icon and label should align as one inline unit:

```html
<span class="est-icon-text">
  <svg class="est-icon est-icon--16" aria-hidden="true" focusable="false">
    <use href="/assets/iconography/sprites/est-ui-icons.svg#est-ui-icon-house"></use>
  </svg>
  Property details
</span>
```

Adjust spacing with `--est-icon-gap` on the container. The icon is decorative because the visible text communicates the meaning.

## Colour

All assets inherit `currentColor`:

```html
<span class="est-icon-text" style="color: var(--status-success-colour)">
  <svg class="est-icon est-icon--16" aria-hidden="true" focusable="false">
    <use href="/assets/iconography/sprites/est-ui-icons.svg#est-ui-icon-check-circle"></use>
  </svg>
  Upload complete
</span>
```

Do not rely on colour or the icon alone for important status meaning. Keep visible text for success, warning, error and other states.

## Icon-only controls

Prefer the product design system's button component. Where no component exists, `.est-icon-button` supplies only layout, a 44px minimum target and icon centring:

```html
<button class="your-button est-icon-button" type="button" aria-label="Add property">
  <svg class="est-icon est-icon--16" aria-hidden="true" focusable="false">
    <use href="/assets/iconography/sprites/est-ui-icons.svg#est-ui-icon-plus"></use>
  </svg>
</button>
```

The button owns the accessible name and focus behaviour. The SVG remains hidden from assistive technology.

## Block and feature use

Use `est-icon--block` when an Icon should not align to a text baseline:

```html
<svg class="est-icon est-icon--48 est-icon--block" aria-hidden="true" focusable="false">
  <use href="/assets/iconography/sprites/est-icons.svg#est-icon-heat-pump"></use>
</svg>
```

## External sprite requirements

Serve the sprite from the same application origin as the page. Preserve the generated symbol IDs and paths. Version or fingerprint the containing asset directory when long-lived caching is enabled.

Do not paste the complete sprite into every repeated component. Load or reference one shared sprite per family.

## Review checklist

- Use the canonical sprite ID or generated individual SVG path.
- Load the optional helper stylesheet once, not per component.
- Choose an intentional rendered size and inspect it in context.
- Set colour through `color`; do not modify path fills.
- Keep decorative SVGs hidden from assistive technology.
- Put accessible names and keyboard behaviour on the containing control.
- Keep visible text for important states.
- Retain the bundle licence notices when copying assets into a product.

Read [the accessibility guidance](accessibility.md) for the full decision model and examples.
