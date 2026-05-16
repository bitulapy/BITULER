# BITULER (v1.4)

Bituler is a schedule maker created by Bitula~ Since every VTuber needs to edit
their schedule every week, why not use a tool that simplifies the process?

Bituler is also available at:
[https://bituler.netlify.app](https://bituler.netlify.app)

<img width="1878" height="859" alt="Bituler Interface" src="https://github.com/user-attachments/assets/b49fefaa-ab9e-4a8f-9f10-67a84b60ef4f" />

## HOW TO CONTRIBUTE A THEME (v1.3+)

In the latest version, themes are loaded dynamically via a search system. You no
longer need to manually edit the `index.html` file to add a new theme.

### 1. Register your Theme

Open the `themes.json` file in the root directory and add your theme details to
the array.

- **id**: This must match your CSS filename (without the `.css` extension).
- **label**: The name that will appear in the search results.

```json
[
  { "id": "synthwave", "label": "Synthwave" },
  { "id": "lunar", "label": "Fortune Teller" },
  { "id": "your-theme-id", "label": "Your Theme Name" }
]
```

### 2. Create the CSS File

Create a new CSS file inside the `styles/themes/` directory named exactly after
your ID: `styles/themes/your-theme-id.css`

> **Note:** You do **not** need to add a `<link>` tag in `index.html`. The
> Bituler engine will automatically inject the stylesheet when your theme is
> selected from the search bar.

### 3. Styling Protocol

The application applies a specific class to the `<body>` tag based on the
selected theme. Use CSS variables to define your theme's look.

#### Theme CSS Example (`styles/themes/synthwave.css`)

```css
body.theme-synthwave {
  /* Color Palette */
  --bg-color: #1a0f2e;
  --panel-bg: #1a0f2e;
  --main-color: #ff2aa3;
  --secondary-color: #ff2aa3;
  --tertiary-color: #e5c890;
  --text-main: #a6d189;
  --text-muted: #7f8c8d;
  --grid-color: rgba(44, 62, 80, 0.05);
  --any-color-to-call: #ffff;

  /* Typography */
  --font-heading: "Orbitron", sans-serif;
  --font-body: "Inter", sans-serif;
}

/* Custom styling for specific elements within this theme */
body.theme-synthwave .day-row {
  border-left: 4px solid var(--main-color);
}
```

### Summary of Workflow

1. Add your theme `id` and `label` to `themes.json`.
2. Drop your CSS file into `styles/themes/`.
3. Test it by typing your theme name into the **THEME STYLE** search bar in the
   app!
