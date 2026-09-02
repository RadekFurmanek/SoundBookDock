# SoundBookDock — architecture, specification and delivery plan

## Product

SoundBookDock is a local-first, installable web application for music,
audiobooks and podcasts. The same responsive UI works on a phone, tablet and
desktop and can be packaged with a WebView. There is no application server or
remote database: the browser stores the catalog, preferences, playback state
and offline files on the device.

## Architecture

```text
UI (responsive PWA)
  └─ application services (library, queue, cache, source accounts)
      └─ domain (Track, Playlist, PlaybackSession, resume and timers)
          └─ adapters (File System Access, IndexedDB, Cache Storage, Media Session)
```

The source adapter contract is `list()` plus `open(track)` returning a
browser-readable `Blob` or URL. A local-file adapter is available first.
Google Drive, Nextcloud, SMB and FTP/SFTP require user-configured credentials
and a browser-compatible HTTPS/CORS gateway or native wrapper; browsers cannot
connect directly to SMB/SFTP safely. Adapters must never send credentials to a
SoundBookDock server.

IndexedDB is the production persistence boundary (library, playlists, resume
positions, settings and cache metadata). Cache Storage contains media selected
for offline use. The current demo uses localStorage and object URLs so it works
without a build server; replacing that adapter does not change the domain API.
Media Session supplies lock-screen controls, while the HTML media element owns
audio playback. A service worker caches only the app shell.

## Functional specification

- Import local audio by file picker or drag and drop; accept MP3, FLAC, AAC,
  M4A, OGG, OPUS, WAV, ALAC and M4B where the platform codec supports it.
- Show one searchable library with title, type, duration and source.
- Play, pause, stop, seek, next, previous, shuffle and repeat (off/track/queue).
- Keep an independent queue and resume position for every playlist.
- Create and manage manual playlists.
- Configure a sleep timer that survives navigation and stops playback when due.
- Install as a PWA and keep the app shell available offline.
- Expose an offline/cache boundary for future cloud downloads.
- Provide audiobook/podcast metadata fields and chapter support in the next
  adapter iteration; loudness normalization and Web Audio equalizer presets
  follow once a real audio graph is added.

## Delivery plan

1. **Foundation (implemented)**: domain tests, local import, responsive player,
   playlists, persistence, Media Session and service worker.
2. **Storage**: IndexedDB repositories, cache-size accounting, quota warnings,
   offline album/playlist jobs and restart-safe migrations.
3. **Sources**: File System Access/NAS selection, OAuth Drive, Nextcloud
   WebDAV, and native-wrapper SMB/SFTP adapters with retry/range streaming.
4. **Media features**: audiobook chapters, podcast feeds, speed control,
   loudness normalization, equalizer presets and gapless playback.
5. **Release quality**: accessibility audit, encrypted platform credentials,
   background/offline integration tests, packaging and performance budgets.
