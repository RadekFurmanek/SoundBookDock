# SoundBookDock

Local-first audio player for music, audiobooks and podcasts.

## Run locally

The application is a static PWA and needs no server-side database. Serve the
repository root over HTTP so module scripts and the service worker work:

```sh
npx serve .
```

Open the displayed URL, choose **+ Přidat soubory**, and start playback. The
library metadata, playlists, resume positions and sleep timer are stored in
the browser's local storage. Audio files are held by the current browser
session; persistent offline media is part of the IndexedDB/Cache Storage
phase described in [`docs/architecture.md`](docs/architecture.md).

## Development

```sh
npm test
npm run typecheck
```