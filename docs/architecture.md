# SoundBookDock – initial architecture

## Product direction

SoundBookDock is a local-first progressive web application packaged for mobile
when needed. The browser is the UI and playback runtime; there is no
application server or remote database.

## Layers

- **UI shell**: responsive web UI and installable PWA shell. It owns navigation,
  accessibility, and media controls.
- **Application services**: coordinate library scanning, source authentication,
  streaming, cache/offline jobs, and playback commands.
- **Domain**: source-independent models and rules for tracks, playlists,
  playback state, resume positions, shuffle, repeat, and sleep timers.
- **Adapters**: IndexedDB for the catalog, settings, cache metadata, and resume
  state; the browser Media Session and Web Audio APIs for playback; source
  adapters for local files, Google Drive, Nextcloud, SMB, and FTP/SFTP.

## Storage and privacy

All metadata, credentials/tokens, settings, and playback state stay on the
device. IndexedDB is the primary database and the Cache Storage API holds
offline media. Credentials are supplied by the user and should be encrypted
using a device-protected key where the target platform supports it.

## Playback constraints

Playback uses one HTML media element initially, with HTTP range requests and a
bounded local cache. Media Session actions provide lock-screen controls. The
sleep timer is persisted and evaluated while the app is backgrounded; a
service worker is used for cache access and app-shell availability, not for
owning long-running audio playback.

## Delivery phases

1. Establish the domain model and tests for playback and resume persistence.
2. Add the IndexedDB repository and a local-file source adapter.
3. Add the PWA shell, Media Session integration, and offline cache controls.
4. Add cloud/SMB/FTP adapters behind the same source interface.
5. Add audiobooks, podcasts, equalizer presets, loudness normalization, and
   polished mobile/desktop UI.
