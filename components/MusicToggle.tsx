"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Nhạc nền. Trình duyệt chặn autoplay nên nhạc CHỈ phát khi bấm nút.
 * File nhạc đặt tại public/music.mp3 (xem README).
 */
export default function MusicToggle({ night }: { night: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.35;
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    void el
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Chưa có file nhạc hoặc trình duyệt từ chối — im lặng, không báo lỗi.
        setUnavailable(true);
        setPlaying(false);
      });
  }, [playing]);

  return (
    <>
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        preload="none"
        onError={() => setUnavailable(true)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
        title={
          unavailable
            ? "Chưa có file nhạc (public/music.mp3)"
            : playing
              ? "Tắt nhạc"
              : "Bật nhạc"
        }
        className={[
          "flex h-11 w-11 items-center justify-center rounded-full border text-lg transition",
          "glass shadow-sm active:scale-95",
          night
            ? "border-white/20 bg-white/10 text-night hover:bg-white/20"
            : "border-white/60 bg-white/50 text-day hover:bg-white/70",
          playing ? "animate-pulseSoft" : "",
        ].join(" ")}
      >
        {playing ? "🎵" : "🔇"}
      </button>
    </>
  );
}
