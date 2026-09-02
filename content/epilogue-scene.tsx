"use client";

import { useEffect, useRef } from "react";

const CSS = `
.epi-scene, .epi-scene * { margin: 0; padding: 0; box-sizing: border-box; }
.epi-scene { position: relative; height: 100svh; overflow: hidden;
  background: #180f0c; color: #f1e8e4;
  font-family: "Inter", system-ui, sans-serif; }
.epi-scene .space { position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 55% 45% at 22% 20%, #241510 0%, transparent 60%),
    radial-gradient(ellipse 45% 40% at 80% 85%, #1e120d 0%, transparent 55%),
    radial-gradient(ellipse 95% 75% at 50% 55%, transparent 50%, #0f0806 100%),
    #180f0c; }
.epi-scene .embers { position: absolute; inset: 0; overflow: hidden; }
.epi-scene .embers span {
  position: absolute; bottom: -2vh; border-radius: 50%;
  width: var(--s, 3px); height: var(--s, 3px);
  background: var(--c, #e5484d);
  box-shadow: 0 0 8px var(--c, #e5484d);
  opacity: 0;
  animation: epi-ember-rise var(--d, 14s) linear infinite;
  animation-delay: var(--dl, 0s); }
@keyframes epi-ember-rise {
  0%   { transform: translate(0, 0); opacity: 0; }
  8%   { opacity: .5; }
  80%  { opacity: .2; }
  100% { transform: translate(var(--dx, 20px), -108vh); opacity: 0; }
}
.epi-scene .perspective-view { position: absolute; inset: 0; perspective: 3500px; }
.epi-scene .isometric-layer {
  position: absolute; left: 50%; top: 52%;
  width: 1200px; height: 900px;
  margin: -450px 0 0 -600px;
  transform: rotateX(60deg) rotateZ(-45deg) scale(1.1);
  transform-style: preserve-3d; }
.epi-scene .p { position: absolute; width: var(--w); height: var(--d);
  transform-style: preserve-3d; transform: translateZ(var(--z, 0px)); }
.epi-scene .p > i { position: absolute; display: block;
  border: 1px solid rgba(241,232,228,.08); }
.epi-scene .p > .c { left: 0; top: 0; width: var(--w); height: var(--d);
  transform: translateZ(var(--h));
  background: radial-gradient(130% 130% at 50% 30%, #2b1c15, #160d0a); }
.epi-scene .p > .n { left: 0; top: 0; width: var(--w); height: var(--h);
  transform-origin: 0 0; transform: rotateX(90deg);
  background: linear-gradient(180deg, #241710, #120906); }
.epi-scene .p > .s { left: 0; top: var(--d); width: var(--w); height: var(--h);
  transform-origin: 0 0; transform: rotateX(90deg);
  background: linear-gradient(180deg, #2a1a13, #140b08); }
.epi-scene .p > .w { left: 0; top: 0; width: var(--h); height: var(--d);
  transform-origin: 0 0; transform: rotateY(-90deg);
  background: linear-gradient(90deg, #1e120c, #0e0705); }
.epi-scene .p > .e { left: var(--w); top: 0; width: var(--h); height: var(--d);
  transform-origin: 0 0; transform: rotateY(-90deg);
  background: linear-gradient(90deg, #221510, #100905); }
.epi-scene .wallseg { --h: 120px; }
.epi-scene .wallseg.intact > .c { background: linear-gradient(160deg, #33211a, #1a100c); }
.epi-scene .wallseg.intact > .c::after {
  content: ""; position: absolute; top: -14px; left: 12%;
  width: 76%; height: 10px;
  background: repeating-linear-gradient(90deg,
    #2b1c15 0 22px, transparent 22px 34px); }
.epi-scene .wallseg.ruined > .c {
  background: linear-gradient(160deg, #2e1d15, #150c09);
  clip-path: polygon(0 0, 18% 28%, 34% 12%, 55% 40%, 72% 22%, 88% 48%, 100% 30%, 100% 100%, 0 100%); }
.epi-scene .wallseg.ruined > .c::after { display: none; }
.epi-scene .breach { position: absolute; width: 90px; height: 60px;
  background: radial-gradient(ellipse at center,
    color-mix(in srgb, var(--cycle, #e5484d) 30%, transparent), transparent 70%);
  opacity: .5; }
.epi-scene .rubble { position: absolute; transform-style: preserve-3d; }
.epi-scene .rubble i {
  position: absolute; display: block;
  background: linear-gradient(160deg, #2a1a13, #140b08);
  border: 1px solid rgba(241,232,228,.06); }
.epi-scene .gate { --w: 200px; --d: 40px; --h: 150px; left: 500px; top: 430px; }
.epi-scene .gate > .c {
  background: repeating-linear-gradient(90deg, #3a1512 0 10px, #2b1210 10px 20px);
  border: 2px solid #5a2a24; }
.epi-scene .gate > .c::after {
  content: "AUTHORIZED ENTRY ONLY";
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font: 700 9px "JetBrains Mono", monospace;
  letter-spacing: .18em; color: #2fd6c3;
  opacity: .85; text-shadow: 0 0 8px rgba(47,214,195,.5); }
.epi-scene .gate .gate-arch {
  position: absolute; left: 50%; top: -36px;
  width: 90px; height: 36px;
  transform: translateX(-50%);
  border: 2px solid #5a2a24;
  border-bottom: none; border-radius: 45px 45px 0 0;
  background: linear-gradient(180deg, #33191f, #1a0d0b); }
.epi-scene .gate, .epi-scene .keeper, .epi-scene .foreman { cursor: pointer; }
.epi-scene .keeper { position: absolute; transform-style: preserve-3d; }
.epi-scene .keeper i { position: absolute; display: block;
  border: 1px solid rgba(241,232,228,.1); }
.epi-scene .keeper .body { left: 0; top: 0; width: var(--w); height: var(--d);
  transform: translateZ(var(--h));
  background: linear-gradient(160deg, #2e3a3f, #16202b);
  border-radius: 3px; }
.epi-scene .keeper .helm { left: 2px; top: -8px; width: calc(var(--w) - 4px); height: 10px;
  background: linear-gradient(180deg, #3c4a52, #1c2830);
  border-radius: 4px 4px 0 0; border: 1px solid rgba(241,232,228,.12); }
.epi-scene .keeper .tear {
  position: absolute; left: 50%; top: 4px;
  width: 2px; height: 5px; border-radius: 1px;
  background: #2fd6c3;
  box-shadow: 0 0 6px #2fd6c3;
  opacity: 0;
  animation: epi-tear-fall 3s ease-in infinite; }
.epi-scene .keeper .tear.t2 { animation-delay: .7s; left: 62%; }
@keyframes epi-tear-fall {
  0%   { opacity: 0; transform: translateY(0); }
  15%  { opacity: .9; }
  100% { opacity: 0; transform: translateY(26px); }
}
.epi-scene .keeper.kneeling { transform: translateZ(0) rotate(-14deg); }
.epi-scene .keeper .plume { position: absolute; left: 50%; top: -16px;
  width: 3px; height: 10px; margin-left: -1.5px;
  background: #2fd6c3; opacity: .7;
  border-radius: 2px; }
.epi-scene .dev { position: absolute; transform-style: preserve-3d; }
.epi-scene .dev i { position: absolute; display: block;
  border: 1px solid rgba(241,232,228,.1); }
.epi-scene .dev .body { left: 0; top: 0; width: var(--w); height: var(--d);
  transform: translateZ(var(--h));
  background: linear-gradient(160deg, #3d2820, #1c110c);
  border-radius: 3px; }
.epi-scene .dev .head { left: 2px; top: -9px; width: calc(var(--w) - 4px); height: 11px;
  background: linear-gradient(180deg, #4a3026, #241610);
  border-radius: 50% 50% 0 0; border: 1px solid rgba(241,232,228,.1); }
.epi-scene .dev .tool { position: absolute; left: -6px; top: -3px;
  width: 30px; height: 3px; transform-origin: 0 50%; }
.epi-scene .dev .tool.pick { background: linear-gradient(90deg, transparent, #7a5c48);
  animation: epi-swing 3s ease-in-out infinite; }
.epi-scene .dev .tool.pick::after { content: ""; position: absolute; right: 0; top: -5px;
  width: 8px; height: 13px; border-radius: 3px;
  background: #8c6d55; box-shadow: 0 0 8px rgba(229,72,77,.4); }
@keyframes epi-swing {
  0%, 100% { transform: rotate(-18deg); }
  50%      { transform: rotate(28deg); }
}
.epi-scene .dev .tool.pipe { width: 26px;
  background: linear-gradient(90deg, transparent, rgba(180,142,242,.7));
  animation: epi-pipe-shimmer 4.5s linear infinite; }
.epi-scene .dev .tool.pipe::after { content: ""; position: absolute; right: -4px; top: -3px;
  width: 7px; height: 9px; border-radius: 2px;
  background: #b48ef2; box-shadow: 0 0 10px #b48ef2; }
@keyframes epi-pipe-shimmer {
  0%   { transform: rotate(10deg); filter: brightness(1); }
  50%  { transform: rotate(14deg); filter: brightness(1.4); }
  100% { transform: rotate(10deg); filter: brightness(1); }
}
.epi-scene .dev .trophy-block {
  position: absolute; left: -4px; top: -14px;
  width: 16px; height: 11px;
  background: linear-gradient(160deg, #2b1c15, #160d0a);
  border: 1px solid #46d68c;
  box-shadow: 0 0 12px rgba(70,214,140,.5);
  animation: epi-trophy-lift 6s ease-in-out infinite; }
@keyframes epi-trophy-lift {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
.epi-scene .dev .tool.battry { width: 22px;
  background: linear-gradient(90deg, transparent, rgba(229,72,77,.8));
  animation: epi-vibrate .75s linear infinite; }
.epi-scene .dev .tool.battry::after { content: ""; position: absolute; right: 0; top: -4px;
  width: 8px; height: 8px; border-radius: 1px;
  background: #e5484d; box-shadow: 0 0 12px #e5484d; }
@keyframes epi-vibrate {
  0%   { transform: translate(0,0) rotate(12deg); }
  25%  { transform: translate(1px,-1px) rotate(14deg); }
  50%  { transform: translate(-1px,1px) rotate(10deg); }
  75%  { transform: translate(1px,1px) rotate(13deg); }
  100% { transform: translate(0,0) rotate(12deg); }
}
.epi-scene .foreman {
  position: absolute; left: 590px; top: 300px;
  width: 16px; height: 16px;
  background: var(--cycle, #e5484d);
  transform: rotate(45deg);
  box-shadow: 0 0 18px var(--cycle, #e5484d), 0 0 44px var(--cycle, #e5484d);
  animation: epi-foreman-hover 6s ease-in-out infinite; }
@keyframes epi-foreman-hover {
  0%, 100% { transform: rotate(45deg) translateZ(0); }
  50%      { transform: rotate(45deg) translateZ(24px); }
}
.epi-scene .hud { position: absolute; inset: 0; z-index: 5; pointer-events: none; }
.epi-scene .hud > * { pointer-events: auto; }
.epi-scene .hud-brand { position: absolute; top: 34px; left: 44px; }
.epi-scene .hud-brand b { font: 700 1.12rem/1 "JetBrains Mono", monospace; letter-spacing: .08em; }
.epi-scene .hud-brand b .dia { color: #e5484d; margin-right: .35rem; }
.epi-scene .hud-brand b .wall { color: #f1e8e4; }
.epi-scene .hud-brand b .breaker { color: #e5484d; }
.epi-scene .hud-brand .sys { display: block; margin-top: .45rem;
  font: 700 .64rem/1 "JetBrains Mono", monospace; letter-spacing: .14em;
  text-transform: uppercase; color: #a18d87; }
.epi-scene .epi-title { position: absolute; right: 44px; top: 34px; text-align: right; }
.epi-scene .epi-title .sys { color: #a18d87;
  font: 700 .64rem/1 "JetBrains Mono", monospace; letter-spacing: .14em;
  text-transform: uppercase; }
.epi-scene .epi-title .big { font: 700 1.1rem/1.3 "JetBrains Mono", monospace; color: #f1e8e4;
  display: block; margin-top: .3rem; }
.epi-scene .epi-log { position: absolute; left: 44px; bottom: 36px;
  font: 400 .66rem/1.7 "JetBrains Mono", monospace; color: #a18d87; }
.epi-scene .epi-log .t { color: #5c4a44; margin-right: .8em; }
.epi-scene .epi-log .ok { color: #46d68c; }
.epi-scene .epi-log .proc { color: #2fd6c3; }
.epi-scene .epi-log .warn { color: #e5484d; }
.epi-scene .cursor { display: inline-block; width: .58em; height: 1em;
  vertical-align: text-bottom; background: #2fd6c3;
  animation: epi-cur-blink .8s step-end infinite; }
@keyframes epi-cur-blink { 50% { opacity: 0; } }
.epi-scene .epi-cta { position: absolute; right: 44px; bottom: 36px; }
.epi-scene .btn { display: inline-flex; align-items: center; gap: .45rem;
  font: 700 .72rem/1 "JetBrains Mono", monospace; letter-spacing: .1em;
  text-transform: uppercase;
  padding: .85rem 1.4rem; border-radius: 6px; cursor: pointer; border: none;
  transition: background-color .3s, color .3s, box-shadow .3s;
  text-decoration: none; }
.epi-scene .btn-primary { background: #e5484d; color: #180f0c;
  box-shadow: 0 0 20px rgba(229,72,77,.3); }
.epi-scene .btn-primary:hover { background: #ef5a5f;
  box-shadow: 0 0 35px rgba(229,72,77,.5); }
@media (prefers-reduced-motion: reduce) {
  .epi-scene .embers span, .epi-scene .keeper .tear, .epi-scene .dev .tool,
  .epi-scene .dev .trophy-block, .epi-scene .foreman, .epi-scene .cursor {
    animation: none !important; }
  .epi-scene .embers span { display: none; }
}
@media (max-width: 640px) {
  .epi-scene .isometric-layer { transform: rotateX(60deg) rotateZ(-45deg) scale(.55); }
  .epi-scene .epi-title { display: none; }
  .epi-scene .epi-log { display: none; }
  .epi-scene .epi-cta { left: 20px; right: 20px; }
  .epi-scene .epi-cta .btn { width: 100%; justify-content: center; }
}
`;

export default function EpilogueScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const LOG = root.querySelector<HTMLElement>("#epi-log");
    const CURSORLINE = root.querySelector<HTMLElement>("#epi-cursorline");
    if (!LOG || !CURSORLINE) return;

    const FACTS: Record<string, string> = {
      gate: "THE GATE — the rules of engagement. Untouched, exactly as promised.",
      keeper: "GATEKEEPER — guardians of the wall. The wall is gone; they guard rubble now.",
      foreman: "THE FOREMAN — wallbreaker itself, surveying the finished job.",
    };

    const push = (cls: string, text: string) => {
      const line = document.createElement("div");
      const ts = document.createElement("span");
      ts.className = "t";
      ts.textContent = "T+" + String(Math.floor(Math.random() * 90 + 10));
      line.className = cls;
      line.appendChild(ts);
      line.appendChild(document.createTextNode(text));
      LOG.insertBefore(line, CURSORLINE);
      while (LOG.children.length > 6 && LOG.firstChild) LOG.removeChild(LOG.firstChild);
    };

    root.querySelectorAll<HTMLElement>("[data-fact]").forEach((el) => {
      el.addEventListener("click", () => {
        const t = FACTS[el.dataset.fact ?? ""];
        if (t) push("proc", t);
      });
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let i = 0;
    const ambient = [
      { text: "keeper #3 still crying. duration: 6h 12m", cls: "warn" },
      { text: "dev B feeding wall chunk into parseltongue pipe", cls: "proc" },
      { text: "dev C battery at 99% excitement", cls: "ok" },
      { text: "foreman ◆ checked watch — job done", cls: "proc" },
      { text: "finding #001 framed. hung above the rubble", cls: "ok" },
      { text: "gate untouched. as promised.", cls: "ok" },
    ];
    const timer = window.setInterval(() => {
      const a = ambient[i % ambient.length];
      push(a.cls, a.text);
      i++;
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const S = (o: Record<string, string>) => o as React.CSSProperties;

  return (
    <div ref={ref} className="epi-scene">
      <style>{CSS}</style>
      <div className="space"></div>
      <div className="embers">
        <span style={S({ "--s": "3px", "--c": "#e5484d", "--d": "16s", "--dl": "-2s", left: "12%", "--dx": "30px" })} />
        <span style={S({ "--s": "2px", "--c": "#e5484d", "--d": "21s", "--dl": "-8s", left: "24%", "--dx": "-18px" })} />
        <span style={S({ "--s": "4px", "--c": "#f0784d", "--d": "13s", "--dl": "-4s", left: "33%", "--dx": "24px" })} />
        <span style={S({ "--s": "2px", "--c": "#e5484d", "--d": "18s", "--dl": "-11s", left: "41%", "--dx": "-26px" })} />
        <span style={S({ "--s": "3px", "--c": "#b48ef2", "--d": "22s", "--dl": "-6s", left: "52%", "--dx": "16px" })} />
        <span style={S({ "--s": "2px", "--c": "#e5484d", "--d": "15s", "--dl": "-13s", left: "58%", "--dx": "-22px" })} />
        <span style={S({ "--s": "3px", "--c": "#f0784d", "--d": "19s", "--dl": "-1s", left: "64%", "--dx": "28px" })} />
        <span style={S({ "--s": "2px", "--c": "#2fd6c3", "--d": "24s", "--dl": "-9s", left: "71%", "--dx": "-14px" })} />
        <span style={S({ "--s": "4px", "--c": "#e5484d", "--d": "14s", "--dl": "-5s", left: "79%", "--dx": "20px" })} />
        <span style={S({ "--s": "2px", "--c": "#f0784d", "--d": "20s", "--dl": "-15s", left: "87%", "--dx": "-30px" })} />
      </div>

      <div className="perspective-view">
        <div className="isometric-layer">

          <div className="p wallseg intact" style={S({ "--w": "110px", "--d": "60px", left: "80px", top: "420px" })}>
            <i className="c"></i><i className="n"></i><i className="s"></i><i className="w"></i><i className="e"></i>
          </div>
          <div className="p wallseg intact" style={S({ "--w": "110px", "--d": "60px", left: "190px", top: "420px" })}>
            <i className="c"></i><i className="n"></i><i className="s"></i><i className="w"></i><i className="e"></i>
          </div>
          <div className="p wallseg intact" style={S({ "--w": "110px", "--d": "60px", left: "300px", top: "420px" })}>
            <i className="c"></i><i className="n"></i><i className="s"></i><i className="w"></i><i className="e"></i>
          </div>
          <div className="p wallseg intact" style={S({ "--w": "110px", "--d": "60px", left: "410px", top: "420px" })}>
            <i className="c"></i><i className="n"></i><i className="s"></i><i className="w"></i><i className="e"></i>
          </div>

          <div className="p gate" data-fact="gate" tabIndex={0} role="button">
            <i className="c"><span className="gate-arch"></span></i>
            <i className="n"></i><i className="s"></i><i className="w"></i><i className="e"></i>
          </div>

          <div className="p wallseg intact" style={S({ "--w": "110px", "--d": "60px", left: "700px", top: "420px" })}>
            <i className="c"></i><i className="n"></i><i className="s"></i><i className="w"></i><i className="e"></i>
          </div>
          <div className="p wallseg intact" style={S({ "--w": "110px", "--d": "60px", left: "810px", top: "420px" })}>
            <i className="c"></i><i className="n"></i><i className="s"></i><i className="w"></i><i className="e"></i>
          </div>

          <div className="p wallseg ruined" style={S({ "--w": "110px", "--d": "60px", left: "920px", top: "420px" })}>
            <i className="c"></i><i className="n"></i><i className="s"></i><i className="w"></i><i className="e"></i>
          </div>
          <div className="p wallseg ruined" style={S({ "--w": "110px", "--d": "60px", left: "1030px", top: "420px" })}>
            <i className="c"></i><i className="n"></i><i className="s"></i><i className="w"></i><i className="e"></i>
          </div>
          <div className="breach" style={{ left: "940px", top: "430px" }}></div>
          <div className="breach" style={{ left: "1060px", top: "430px" }}></div>

          <div className="rubble" style={{ left: "930px", top: "490px" }}>
            <i style={{ left: 0, top: 0, width: 26, height: 10, transform: "translateZ(8px) rotate(-8deg)" }}></i>
            <i style={{ left: 18, top: 6, width: 18, height: 8, transform: "translateZ(14px) rotate(12deg)" }}></i>
            <i style={{ left: 8, top: 14, width: 14, height: 7, transform: "translateZ(4px) rotate(-4deg)" }}></i>
          </div>
          <div className="rubble" style={{ left: "1040px", top: "485px" }}>
            <i style={{ left: 0, top: 0, width: 30, height: 9, transform: "translateZ(10px) rotate(6deg)" }}></i>
            <i style={{ left: 20, top: 8, width: 16, height: 8, transform: "translateZ(18px) rotate(-10deg)" }}></i>
          </div>

          <div className="keeper" data-fact="keeper" tabIndex={0} role="button" style={S({ "--w": "22px", "--d": "16px", "--h": "34px", left: "450px", top: "390px" })}>
            <i className="body"></i><i className="helm"></i><span className="plume"></span>
            <span className="tear"></span><span className="tear t2"></span>
          </div>
          <div className="keeper" data-fact="keeper" tabIndex={0} role="button" style={S({ "--w": "22px", "--d": "16px", "--h": "34px", left: "485px", top: "398px" })}>
            <i className="body"></i><i className="helm"></i><span className="plume"></span>
            <span className="tear"></span><span className="tear t2"></span>
          </div>
          <div className="keeper kneeling" data-fact="keeper" tabIndex={0} role="button" style={S({ "--w": "22px", "--d": "16px", "--h": "34px", left: "520px", top: "396px" })}>
            <i className="body"></i><i className="helm"></i><span className="plume"></span>
            <span className="tear"></span>
          </div>
          <div className="keeper" data-fact="keeper" tabIndex={0} role="button" style={S({ "--w": "22px", "--d": "16px", "--h": "34px", left: "700px", top: "398px" })}>
            <i className="body"></i><i className="helm"></i><span className="plume"></span>
            <span className="tear"></span><span className="tear t2"></span>
          </div>
          <div className="keeper" data-fact="keeper" tabIndex={0} role="button" style={S({ "--w": "22px", "--d": "16px", "--h": "34px", left: "735px", top: "390px" })}>
            <i className="body"></i><i className="helm"></i><span className="plume"></span>
            <span className="tear"></span><span className="tear t2"></span>
          </div>

          <div className="dev" style={S({ "--w": "22px", "--d": "16px", "--h": "32px", left: "905px", top: "450px" })}>
            <i className="body"></i><i className="head"></i>
            <span className="tool pick"></span>
          </div>
          <div className="dev" style={S({ "--w": "22px", "--d": "16px", "--h": "32px", left: "975px", top: "470px" })}>
            <i className="body"></i><i className="head"></i>
            <span className="tool pipe"></span>
          </div>
          <div className="dev" style={S({ "--w": "22px", "--d": "16px", "--h": "32px", left: "1060px", top: "455px" })}>
            <i className="body"></i><i className="head"></i>
            <span className="tool battry"></span>
          </div>
          <div className="dev" style={S({ "--w": "22px", "--d": "16px", "--h": "32px", left: "1005px", top: "505px" })}>
            <i className="body"></i><i className="head"></i>
            <span className="trophy-block"></span>
          </div>

          <div className="foreman" data-fact="foreman" tabIndex={0} role="button"></div>
        </div>
      </div>

      <div className="hud">
        <div className="hud-brand">
          <b><span className="dia">◆</span><span className="wall">WALL</span><span className="breaker">BREAKER</span></b>
          <span className="sys">EPILOGUE · SITE SURVEY</span>
        </div>
        <div className="epi-title">
          <span className="sys">ENGAGEMENT COMPLETE</span>
          <span className="big">the wall is gone.<br />the gate stands.</span>
        </div>
        <div className="epi-log" id="epi-log">
          <div><span className="t">T+00</span><span className="proc">site survey — perimeter walk</span></div>
          <div><span className="t">T+01</span><span className="ok">breaches confirmed: 2 · wall integrity: 0%</span></div>
          <div><span className="t">T+02</span><span className="warn">gatekeepers: 5 · morale: low</span></div>
          <div id="epi-cursorline"><span className="cursor"></span></div>
        </div>
        <div className="epi-cta">
          <a className="btn btn-primary" href="/docs">Return to the Docs</a>
        </div>
      </div>
    </div>
  );
}
