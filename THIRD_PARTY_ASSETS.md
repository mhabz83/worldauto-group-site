# Third-party 3D assets

## Vehicle scanner

- **Title:** Vehicle scanner
- **Creator:** [harikumar3d](https://sketchfab.com/harikumar3d)
- **Source:** [Sketchfab model](https://sketchfab.com/3d-models/vehicle-scanner-fc309406a96c4eb1b72aeaf2c540b444)
- **License:** [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Changes:** Textures, ground plane, scan cone, and high-density caster meshes were removed. The remaining scanner geometry was duplicated and incorporated into a new drive-through inspection-lane assembly for the AutoData scene.

The optimized derivative is distributed only as part of this website in
`public/webgl-lines/autodata-scanner.glb`.

# Fonts

## Khand (display voice)

- **Title:** Khand Semibold
- **Creator:** Indian Type Foundry
- **Source:** [Fontshare](https://www.fontshare.com/fonts/khand)
- **License:** [Fontshare Free Font License (ITF FFL)](https://www.fontshare.com/licenses/itf-ffl) — free for personal and commercial use, self-hosting permitted
- **Files:** `app/fonts/Khand-Semibold.woff2` (source mirror) and `public/fonts/Khand-Semibold.woff2` (served)
- **Usage:** hero statement and major section titles only (`--font-display`)

## Switzer (body voice)

- **Title:** Switzer Light (300) and Regular (400)
- **Creator:** Indian Type Foundry
- **Source:** [Fontshare](https://www.fontshare.com/fonts/switzer)
- **License:** [Fontshare Free Font License (ITF FFL)](https://www.fontshare.com/licenses/itf-ffl) — free for personal and commercial use, self-hosting permitted
- **Files:** `app/fonts/Switzer-Light.woff2`, `app/fonts/Switzer-Regular.woff2` (source mirrors) and `public/fonts/Switzer-*.woff2` / `.woff` (served)
- **Usage:** all body copy and UI text (`--font-sans`)
- **Note:** replaced the previously bundled Suisse Intl files (Swiss Typefaces, commercial) on 2026-07-20 because no group license was on record. Switzer matches the width and neo-grotesk tone; the type scale and weights are unchanged.
