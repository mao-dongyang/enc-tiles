# enc-tiles

> Tools to produce vector tiles (mbtiles, pmtiles) from Electronic Navigational Charts (ENCs)

- [styles](./packages/styles/) - MapLibre styles for S-57 Nautical Charts using IHO's S-52 Presentation Library
- [s52](./packages/s52/) - The S-52 Presentation Library in JSON format
- [dai](./packages/dai/) - Parser for S-52 .dai file

## Quick Start (Recommended: mise)

```sh
git clone https://github.com/bkeepers/enc-tiles.git
cd enc-tiles

# Install toolchain declared in mise.toml (Node, env, tasks)
mise install

# Init submodule + install deps + build packages
mise run setup

# Start web app
mise run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Common mise tasks

```sh
mise tasks
mise run build
mise run test
mise run lint
mise run info
```

If you do not use `mise`, the equivalent startup flow is:

```sh
bin/setup
npm start
```

## How it runs (Web rendering path)

Runtime tile URL is composed in `src/index.ts` using:

- `VITE_TILES_URL` (base URL)
- `VITE_TILESET` (file name)

By default (`.env`):

- `VITE_TILES_URL=https://pub-0b8220da652f4a95a2293d0f61351a33.r2.dev`
- `VITE_TILESET=noaa.pmtiles`

So the demo map loads:

- `https://pub-0b8220da652f4a95a2293d0f61351a33.r2.dev/noaa.pmtiles`

Sprites are loaded from:

- `/sprites` (resolved to `public/sprites` in dev)

[Inspect tiles using pmtiles.io](https://pmtiles.io/#url=https%3A%2F%2Fpub-0b8220da652f4a95a2293d0f61351a33.r2.dev%2Fnoaa.pmtiles&map=3.05/39.23/-73.65&inspectFeatures=true).

## Where map files are stored

### 1) Source ENC files (`.000`)

- Input directory: `data/ENC_ROOT/**/*.000`
- Makefile variable: `ENC_DIR := data/ENC_ROOT`

### 2) Generated tile files

- Per-chart tiles: `tiles/**/*.pmtiles`
- Merged tileset: `tiles/noaa.pmtiles`
- Tile metadata catalog: `tiles/catalog.json`

### 3) Files served by the web app

- Default remote tileset: from `VITE_TILES_URL` + `VITE_TILESET`
- Local fallback tiles URL (when `VITE_TILES_URL` is unset): `http://localhost:5173/tiles/noaa.pmtiles`
- Sprite assets: `public/sprites/*` (served as `/sprites/*`)

## Convert S-57 `.000` to PMTiles locally

`bin/s57-to-tiles` converts one ENC file (`.000`) to `.pmtiles`/`.mbtiles`, and auto-assigns min/max zoom by `DSID_INTU`.

Typical flow:

```sh
# 1) (Optional) Download NOAA ENC bundle
make data

# 2) Build all PMTiles and merge to tiles/noaa.pmtiles
make
```

To serve your locally generated tiles in the web app:

```sh
mkdir -p public/tiles
cp tiles/noaa.pmtiles public/tiles/noaa.pmtiles

# Then unset/override remote URL in .env (or shell)
# VITE_TILES_URL=http://localhost:5173/tiles/
```

## Required external tools for local S-57 pipeline

- [GDAL / ogr2ogr](https://gdal.org/) (S-57 read + conversion)
  - S-57 driver docs: https://gdal.org/en/stable/drivers/vector/s57.html
- [tippecanoe / tile-join](https://github.com/felt/tippecanoe) (vector tile build/merge)
- [pmtiles CLI](https://docs.protomaps.com/pmtiles/cli) (tilejson inspection and PMTiles utilities)
- [jq](https://jqlang.org/) (`bin/catalog` JSON aggregation)
- [spreet](https://github.com/flother/spreet) (build sprite sheets used by styles)

## Windows notes

- Run this repo in Git Bash or WSL for Makefile and shell scripts (`bin/*`, `make`, `rm`, `cp`, `ulimit`).
- Ensure symlinks/junctions work for static assets; on Windows, Developer Mode/admin rights may be required for symlink workflows.
- Use exact filename case in imports/paths to avoid cross-platform watcher/HMR inconsistencies.

## Prior Art

- https://github.com/LarsSchy/SMAC-M
- https://github.com/manimaul/njord

## License

This project is licensed under the [Apache License 2.0](./LICENSE).
