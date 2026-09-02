export type PlaybackStatus = "idle" | "playing" | "paused" | "stopped";
export type RepeatMode = "off" | "track" | "queue";

export interface Track {
  id: string;
  title: string;
}

export interface ResumePosition {
  trackId: string;
  positionSeconds: number;
}

export interface PlaybackSnapshot {
  playlistId: string;
  queue: Track[];
  currentIndex: number;
  positionSeconds: number;
  status: PlaybackStatus;
  repeat: RepeatMode;
  shuffle: boolean;
  sleepUntil: number | null;
}

export interface PlaybackStateStore {
  load(playlistId: string): PlaybackSnapshot | null;
  save(snapshot: PlaybackSnapshot): void;
}

export class MemoryPlaybackStateStore implements PlaybackStateStore {
  private readonly snapshots = new Map<string, PlaybackSnapshot>();

  load(playlistId: string): PlaybackSnapshot | null {
    return this.snapshots.get(playlistId) ?? null;
  }

  save(snapshot: PlaybackSnapshot): void {
    this.snapshots.set(snapshot.playlistId, structuredClone(snapshot));
  }
}

export class PlaybackSession {
  private snapshot: PlaybackSnapshot;

  constructor(
    playlistId: string,
    queue: Track[],
    private readonly store: PlaybackStateStore,
  ) {
    const saved = store.load(playlistId);
    this.snapshot =
      saved && saved.queue.length > 0
        ? saved
        : {
            playlistId,
            queue,
            currentIndex: 0,
            positionSeconds: 0,
            status: "idle",
            repeat: "off",
            shuffle: false,
            sleepUntil: null,
          };
  }

  get state(): PlaybackSnapshot {
    return structuredClone(this.snapshot);
  }

  play(): void {
    this.snapshot.status = "playing";
    this.persist();
  }

  pause(): void {
    this.snapshot.status = "paused";
    this.persist();
  }

  stop(): void {
    this.snapshot.status = "stopped";
    this.snapshot.positionSeconds = 0;
    this.persist();
  }

  seek(positionSeconds: number): void {
    this.snapshot.positionSeconds = Math.max(0, positionSeconds);
    this.persist();
  }

  next(): Track {
    if (this.snapshot.repeat !== "track") {
      this.snapshot.currentIndex =
        (this.snapshot.currentIndex + 1) % this.snapshot.queue.length;
    }
    this.snapshot.positionSeconds = 0;
    this.persist();
    return this.currentTrack;
  }

  previous(): Track {
    this.snapshot.currentIndex =
      (this.snapshot.currentIndex - 1 + this.snapshot.queue.length) %
      this.snapshot.queue.length;
    this.snapshot.positionSeconds = 0;
    this.persist();
    return this.currentTrack;
  }

  setSleepTimer(sleepUntil: number | null): void {
    this.snapshot.sleepUntil = sleepUntil;
    this.persist();
  }

  shouldSleep(now = Date.now()): boolean {
    return this.snapshot.sleepUntil !== null && now >= this.snapshot.sleepUntil;
  }

  private get currentTrack(): Track {
    return this.snapshot.queue[this.snapshot.currentIndex];
  }

  private persist(): void {
    this.store.save(this.snapshot);
  }
}
