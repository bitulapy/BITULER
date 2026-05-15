# BITULER

Bituler is a schedule maker that is made by Bitula~ Since every VTuber need to
edit their schedule everyweek, why not we make a website that can simplify the
progress?

Bituler also available in https://bituler.netlify.app Use it now!
<img width="1878" height="859" alt="image" src="https://github.com/user-attachments/assets/b49fefaa-ab9e-4a8f-9f10-67a84b60ef4f" />

## HOW TO CONTRIBUTE THEME

- in the index.html file you can add your theme selector option

```html
<select id="themeSelector">
  <!-- ... -->
  <option value="synthwave">Synthwave</option>
  <!-- add yours here -->
</select>
```

- create a CSS file inside styles/themes/your-theme.css
- add your CSS file inside the index.html

```html
  <head>
    <!-- ... -->
    <link rel="stylesheet" href="styles/themes/catpuccin-latte.css" />
    <link rel="stylesheet" href="styles/themes/synthwave.css" />
    <!-- insert new CSS file here -->
  </head>
```
### Body have special classes based on selected themes
#### Theme css file example
```css
body.theme-synthwave {
  --bg-color: #1a0f2e;
  --panel-bg: #1a0f2e;
  --main-color: #ff2aa3;
  --secondary-color: #ff2aa3;
  --tertiary-color: #e5c890;
  --text-main: #a6d189;
  --text-muted: #7f8c8d;
  --grid-color: rgba(44, 62, 80, 0.05);
  --font-heading: "Inter", sans-serif;
  --font-body: "Inter", sans-serif;
  --box-bg: #2e2156;
  --box-border: rgba(44, 62, 80, 0.1);
}

/* select the element only in synthwave theme */
body[class="theme-synthwave"] .... {
  color: #ff2aa3;
}
```
