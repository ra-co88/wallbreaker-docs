"use client";

import { useEffect, useRef } from "react";

/**
 * /break-the-wall — the hidden theater.
 *
 * Reached only through the footer button (and the glossary diamond).
 * A fullscreen dark room that plays the campaign film once, then
 * settles on the slogan card. No docs chrome, no navigation except
 * the quiet return link at the end.
 */
export default function BreakTheWallPage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const vid = root.querySelector<HTMLVideoElement>("video");
    if (!vid) return;

    // room fades in with the first frame
    vid.addEventListener("play", () => {
      root?.classList.add("playing");
    });

    // when the film ends, surface the return link
    vid.addEventListener("ended", () => {
      root?.classList.add("ended");
    });
  }, []);

  return (
    <div ref={ref} className="btw-room">
      <style>{`
.btw-room, .btw-room * { margin: 0; padding: 0; box-sizing: border-box; }
.btw-room {
  position: fixed; inset: 0; z-index: 200;
  background: #0d0807; color: #f1e8e4;
  font-family: "Inter", system-ui, sans-serif;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; animation: btw-in 1.2s ease .3s forwards;
}
@keyframes btw-in { to { opacity: 1; } }
.btw-room video {
  width: 100vw; height: 100vh; object-fit: contain;
  background: #0d0807;
}
.btw-room .btw-return {
  position: absolute; right: 44px; bottom: 36px;
  font: 700 .72rem/1 "JetBrains Mono", monospace;
  letter-spacing: .1em; text-transform: uppercase;
  color: #a18d87; text-decoration: none;
  padding: .85rem 1.4rem; border-radius: 6px;
  border: 1px solid rgba(241,232,228,.07);
  background: rgba(33,21,17,.78);
  opacity: 0; transform: translateY(8px);
  transition: opacity .8s ease, transform .8s ease,
    color .3s, border-color .3s, box-shadow .3s;
}
.btw-room.playing .btw-return { opacity: .55; transform: translateY(0); }
.btw-room.ended .btw-return { opacity: 1; color: #2fd6c3;
  border-color: rgba(47,214,195,.3); }
.btw-room .btw-return:hover { opacity: 1; color: #f1e8e4; }
.btw-room .btw-corner {
  position: absolute; top: 34px; left: 44px;
  font: 700 .64rem/1 "JetBrains Mono", monospace;
  letter-spacing: .14em; text-transform: uppercase; color: #5c4a44;
}
`}</style>
      <span className="btw-corner">◆ WALLBREAKER — FOR THE CURIOUS</span>
      <video controls autoPlay muted playsInline src="/break-the-wall.mp4" />
      <a className="btw-return" href="/docs">Return to the Docs</a>
    </div>
  );
}
