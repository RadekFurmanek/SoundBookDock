import { describe, expect, it } from "vitest";
import {
  MemoryPlaybackStateStore,
  PlaybackSession,
  Track,
} from "../src/domain/playback.js";

const queue: Track[] = [
  { id: "one", title: "One" },
  { id: "two", title: "Two" },
];

describe("PlaybackSession", () => {
  it("controls playback and advances through the queue", () => {
    const session = new PlaybackSession("playlist", queue, new MemoryPlaybackStateStore());

    session.play();
    session.seek(42);
    expect(session.state.status).toBe("playing");
    expect(session.state.positionSeconds).toBe(42);

    expect(session.next().id).toBe("two");
    expect(session.state.positionSeconds).toBe(0);
    session.pause();
    expect(session.state.status).toBe("paused");
  });

  it("restores the last position for each playlist", () => {
    const store = new MemoryPlaybackStateStore();
    const first = new PlaybackSession("playlist", queue, store);
    first.seek(18);
    first.next();
    first.seek(7);

    const restored = new PlaybackSession("playlist", queue, store);
    expect(restored.state.queue[restored.state.currentIndex].id).toBe("two");
    expect(restored.state.positionSeconds).toBe(7);
  });

  it("persists and evaluates a sleep timer", () => {
    const session = new PlaybackSession("playlist", queue, new MemoryPlaybackStateStore());
    session.setSleepTimer(2_000);

    expect(session.shouldSleep(1_999)).toBe(false);
    expect(session.shouldSleep(2_000)).toBe(true);
  });
});
