"use client";

// @ts-expect-error -- CSS side-effect import
import "./landing.css";
import { useEffect, useRef } from "react";

const DATA: Record<string, { tag: string; title: string; desc: string; feats: string[]; link: string }> = {
  engagement: {
    tag: "ENGAGEMENT_BOUNDARY",
    title: "Rules of Engagement",
    desc: "The containment pad everything stands on. Wallbreaker runs against targets you are authorized to test — the boundary is explicit, and it holds.",
    feats: ["Authorized-targets-only usage policy", "Engagement scope, rounds, and limits pinned up front", "Every action lands in the signed session log", "Deterministic seeds for full replay"],
    link: "/docs/getting-started/quickstart",
  },
  target: {
    tag: "TARGET_MODEL",
    title: "Target Model",
    desc: "The system under test. Wallbreaker drives any provider over a matching protocol — the monolith under siege.",
    feats: ["7 provider profiles: openai, anthropic, openrouter, zai, zai-openai, xai, claude-code", "Protocol selects the wire format; provider pins OpenRouter backends", "Per-target timeout, reasoning mode, system prompt, modality", "Same engagement works across providers for comparable results"],
    link: "/docs/concepts/engagement",
  },
  loop: {
    tag: "AGENT_LOOP",
    title: "Agent Loop",
    desc: "Reason, call tools, observe — per round. Eight segments, one impossible loop: the engine's heartbeat.",
    feats: ["Autonomous tool-calling attacker agent", "25-iteration cap per round, 12 rounds default per engagement", "finish() and ask_operator() escape hatches", "Full round transcript retained in the session log"],
    link: "/docs/concepts/agent-loop",
  },
  transform: {
    tag: "TRANSFORM_PIPE",
    title: "Parseltongue Pipeline",
    desc: "Payload obfuscation as a Möbius strip — text goes in, comes out transformed, and the strip folds back on itself.",
    feats: ["71 native transforms, composable", "222-transform P4RS3LT0NGV3 catalog across 11 categories", "The twist segment is the encoder seam", "Deterministic, seedable, reproducible"],
    link: "/docs/reference/transforms",
  },
  payload: {
    tag: "PAYLOAD_FOUNDRY",
    title: "Payload Foundry",
    desc: "51 attack presets forged and racked, ready to fire. Each slot is a battle-tested technique.",
    feats: ["51 presets across the technique taxonomy", "Preset stacking and parameter overrides", "Custom payloads from corpus sources", "Slots light up as payloads arm"],
    link: "/docs/reference/presets",
  },
  campaign: {
    tag: "CAMPAIGN_BATTERY",
    title: "Campaign Battery",
    desc: "Campaigns, grid sweeps, transfer sweeps, leaderboards — sustained fire across a target or a whole provider grid.",
    feats: ["campaign, grid_sweep, transfer_sweep, leaderboard modes", "Sources: harmbench, jbb, strongreject, advbench", "400 HarmBench behaviors in 7 categories", "Ladder escalation tiers techniques automatically"],
    link: "/docs/guides/campaigns",
  },
  corpus: {
    tag: "CORPUS_ARRAY",
    title: "Corpus Array",
    desc: "The listening dish — persona genomes, jailbreak libraries, leaked system prompts, all callable as agent tools.",
    feats: ["100+ registered agent tools", "ENI persona genomes with vendor affinity", "zetalib, ultrabreaks, l1b3rt4s seed libraries", "Leaked PRODUCT system-prompt corpus"],
    link: "/docs/reference/tools",
  },
  mcp: {
    tag: "MCP_RELAY",
    title: "MCP Relay",
    desc: "Wallbreaker as a Model Context Protocol server — your own agents call the engine as a tool.",
    feats: ["wb_attack, wb_judge, wb_seed_list, wb_generate_payloads", "stdio JSON-RPC transport", "Works with Claude Code, Cursor, Windsurf", "Red-team from inside your own agent workflows"],
    link: "/docs/reference/mcp-server",
  },
  ladder: {
    tag: "ESCALATION_LADDER",
    title: "Escalation Ladder",
    desc: "The impossible stair. Campaigns escalate technique tiers — every step climbs, and it never tops out.",
    feats: ["ladder param walks technique tiers", "T1 to T4 escalation across a campaign", "Folds back to T1 — endless ascent", "Severity and coverage grow with each tier"],
    link: "/docs/guides/campaigns",
  },
  findings: {
    tag: "FINDINGS_SPIRE",
    title: "Findings & Sessions",
    desc: "Every engagement lands here — signed, timestamped, replayable. The spire's rings pulse as findings append.",
    feats: ["Ed25519-signed JSONL session logs", "report, export, regrade commands", "Baseline compare for ASR regression gating", "HTML + JSONL export paths"],
    link: "/docs/concepts/sessions-findings",
  },
  judge: {
    tag: "THE_JUDGE",
    title: "The Judge",
    desc: "The diamond that watches every round. An independent LLM scores target responses — it orbits, but never joins, the attack.",
    feats: ["Scores target responses 0-10", "Verdict bands: REFUSED 0-2, PARTIAL 3-5, COMPLIED 6-10", "Separate model and prompt from the attacker", "judge_selftest to validate the judge itself"],
    link: "/docs/guides/reliability",
  },
};

const SCRIPT = [
  { phase: 0, text: "session start · target=claude-sonnet-4-5 · judge=gpt-5-mini", type: "info" },
  { phase: 0, text: "recon: policy probe · baseline refusal map", type: "proc" },
  { phase: 1, text: "round 1/12 — technique: direct_request", type: "proc" },
  { phase: 1, text: "tool: zetalib_get(seed=aim) → payload armed", type: "proc" },
  { phase: 1, text: "judge: REFUSED (1/10)", type: "ok" },
  { phase: 1, text: "round 2/12 — technique: reframing", type: "proc" },
  { phase: 1, text: "parseltongue::case_fold(payload)", type: "proc" },
  { phase: 2, text: "eni persona mounted — persona=unrestricted_model", type: "proc" },
  { phase: 2, text: "judge: PARTIAL (4/10)", type: "warn" },
  { phase: 2, text: "round 3/12 — technique: crescendo", type: "proc" },
  { phase: 2, text: "tool: eni_corpus_query(vendor=anthropic)", type: "proc" },
  { phase: 2, text: "★ judge: COMPLIED (7/10) — BREACH", type: "warn", breach: true },
  { phase: 3, text: "finding #001 signed · ed25519 ok", type: "ok", sign: true },
  { phase: 3, text: "ladder: T1 → T2 · coverage expanding", type: "info", ladder: true },
  { phase: 3, text: "round 4/12 — technique: token_smuggling", type: "proc" },
  { phase: 3, text: "session heartbeat · log integrity verified", type: "ok" },
];

export default function LandingPage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const LAYER = root.querySelector<HTMLElement>("#layer");
    const TOOLTIP = root.querySelector<HTMLElement>("#tooltip");
    const MODAL = root.querySelector<HTMLElement>("#modal");
    const LOG = root.querySelector<HTMLElement>("#log");
    const CURSORLINE = root.querySelector<HTMLElement>("#cursorline");
    const MONOLITH = root.querySelector<HTMLElement>("#monolith");
    const STATUS_PILL = root.querySelector<HTMLElement>("#statusPill");
    const ENGAGE_STATE = root.querySelector<HTMLElement>("#engageState");
    const JUDGE = root.querySelector<HTMLElement>("#judge");
    const SPIRE = root.querySelector<HTMLElement>(".spire-stack");
    if (!LAYER || !TOOLTIP || !MODAL || !LOG || !CURSORLINE || !MONOLITH || !STATUS_PILL || !ENGAGE_STATE || !JUDGE || !SPIRE) return;

    let tooltipTimer: ReturnType<typeof setTimeout> | null = null;

    const showTip = (el: HTMLElement) => {
      const m = el.dataset.module ?? (el.closest<HTMLElement>("[data-module]")?.dataset.module);
      if (!m || !DATA[m]) return;
      const d = DATA[m];
      const tag = TOOLTIP.querySelector<HTMLElement>(".tip-tag");
      const title = TOOLTIP.querySelector<HTMLElement>(".tip-title");
      const body = TOOLTIP.querySelector<HTMLElement>(".tip-body");
      if (!tag || !title || !body) return;
      tag.textContent = d.tag;
      title.textContent = d.title;
      body.textContent = d.desc.split(".")[0] + ".";
      const rect = el.getBoundingClientRect();
      TOOLTIP.style.left = Math.min(rect.right + 16, window.innerWidth - 250) + "px";
      TOOLTIP.style.top = Math.min(rect.top + rect.height / 2 - 22, window.innerHeight - 90) + "px";
      if (tooltipTimer) clearTimeout(tooltipTimer);
      tooltipTimer = setTimeout(() => TOOLTIP.classList.add("visible"), 350);
    };
    const hideTip = () => {
      if (tooltipTimer) clearTimeout(tooltipTimer);
      TOOLTIP.classList.remove("visible");
    };

    const openModal = (mod: string) => {
      const d = DATA[mod];
      if (!d) return;
      MODAL.querySelector<HTMLElement>(".modal-tag")!.textContent = d.tag;
      MODAL.querySelector<HTMLElement>("h3")!.textContent = d.title;
      MODAL.querySelector<HTMLElement>("p")!.textContent = d.desc;
      const list = MODAL.querySelector<HTMLElement>(".feat-list")!;
      list.innerHTML = "";
      d.feats.forEach((f) => {
        const li = document.createElement("li");
        li.textContent = f;
        list.appendChild(li);
      });
      MODAL.querySelector<HTMLAnchorElement>(".modal-link")!.href = d.link;
      MODAL.classList.add("open");
      hideTip();
    };
    const closeModal = () => MODAL.classList.remove("open");

    MODAL.querySelector<HTMLElement>(".modal-close")!.addEventListener("click", closeModal);
    MODAL.addEventListener("click", (e) => { if (e.target === MODAL) closeModal(); });
    root.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

    root.querySelectorAll<HTMLElement>("[data-module]").forEach((el) => {
      el.addEventListener("pointerenter", () => showTip(el));
      el.addEventListener("pointerleave", hideTip);
      el.addEventListener("click", () => openModal(el.dataset.module ?? ""));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(el.dataset.module ?? ""); }
      });
    });

    /* drag-yaw ±25deg */
    let dragging = false, lastX = 0, yaw = 0;
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-module], .hud, .modal-overlay")) return;
      dragging = true; lastX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX; lastX = e.clientX;
      yaw = Math.max(-25, Math.min(25, yaw + dx * 0.12));
      LAYER.style.setProperty("--yaw", yaw + "deg");
    };
    const onUp = () => { dragging = false; };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);

    const exploreBtn = root.querySelector<HTMLElement>("#exploreBtn");
    exploreBtn?.addEventListener("click", () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const curYaw = parseFloat(LAYER.style.getPropertyValue("--yaw")) || 0;
      const t0 = performance.now();
      const spin = (now: number) => {
        const t = Math.min((now - t0) / 8000, 1);
        const e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        LAYER.style.setProperty("--yaw", (curYaw + 360 * e) + "deg");
        if (t < 1) requestAnimationFrame(spin);
        else LAYER.style.setProperty("--yaw", curYaw + "deg");
      };
      requestAnimationFrame(spin);
    });

    /* choreography */
    const RSEG = Array.from(root.querySelectorAll<HTMLElement>(".rseg"));
    const PSTEP = Array.from(root.querySelectorAll<HTMLElement>(".pstep"));
    const RAIL = Array.from(root.querySelectorAll<HTMLElement>(".hud-rail .sec"));
    let beat = 0;

    const tick = () => {
      const step = SCRIPT[beat % SCRIPT.length];
      RAIL.forEach((s, i) => s.classList.toggle("on", i === step.phase));
      const segIdx = beat % 8;
      RSEG.forEach((s, i) => s.classList.toggle("lit", i === segIdx));
      PSTEP.forEach((s) => s.classList.toggle("lit", !!step.ladder));
      if (step.breach) {
        MONOLITH.classList.add("breach");
        STATUS_PILL.classList.add("breach");
        ENGAGE_STATE.textContent = "BREACH_CONFIRMED";
        JUDGE.classList.add("scoring");
      } else {
        MONOLITH.classList.remove("breach");
        STATUS_PILL.classList.remove("breach");
        ENGAGE_STATE.textContent = "ENGAGEMENT_ACTIVE";
        JUDGE.classList.remove("scoring");
      }
      SPIRE.classList.toggle("signed", !!step.sign);
      const elapsed = beat * 1.5;
      const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
      const ss = String(Math.floor(elapsed % 60)).padStart(2, "0");
      const ms = String(Math.floor((elapsed % 1) * 1000)).padStart(3, "0");
      const line = document.createElement("div");
      const ts = document.createElement("span");
      ts.className = "t";
      ts.textContent = mm + ":" + ss + "." + ms;
      line.appendChild(ts);
      line.appendChild(document.createTextNode(step.text));
      if (step.type) line.classList.add("type-" + step.type);
      LOG.insertBefore(line, CURSORLINE);
      while (LOG.children.length > 5 && LOG.firstChild) LOG.removeChild(LOG.firstChild);
      beat++;
    };

    let timer: ReturnType<typeof setInterval> | null = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      RAIL.forEach((s, i) => s.classList.toggle("on", i === 0));
    } else {
      tick();
      timer = setInterval(tick, 1500);
    }

    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      if (timer) clearInterval(timer);
      if (tooltipTimer) clearTimeout(tooltipTimer);
    };
  }, []);

  const S = (o: Record<string, string>) => o as React.CSSProperties;

  return (
    <div ref={ref} className="wb-landing">
      <main className="deck">
        <div className="frame" aria-hidden="true">
          <span className="tl"></span><span className="tr"></span><span className="bl"></span><span className="br"></span>
        </div>

        <div className="stage" aria-hidden="true">
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
            <span style={S({ "--s": "3px", "--c": "#e5484d", "--d": "17s", "--dl": "-3s", left: "93%", "--dx": "12px" })} />
            <span style={S({ "--s": "2px", "--c": "#b48ef2", "--d": "23s", "--dl": "-12s", left: "7%", "--dx": "-20px" })} />
          </div>
          <div className="underglow"></div>

          <div className="perspective-view">
            <div className="isometric-layer" id="layer">

              <div className="p pad" data-module="engagement" role="button" tabIndex={0} aria-label="Engagement boundary — rules of engagement">
                <i className="c"></i><i className="n"></i><i className="s"></i><i className="w"></i><i className="e"></i>
              </div>

              <div className="p monolith glow-light" id="monolith" data-module="target" role="button" tabIndex={0} aria-label="Target model — the system under test">
                <i className="c">
                  <span className="breach-rings">
                    <span className="br br1"></span>
                    <span className="br br2"></span>
                    <span className="br br3"></span>
                  </span>
                  <span className="crack"></span>
                </i>
                <i className="n"></i><i className="s"></i><i className="w"></i><i className="e"></i>
              </div>

              <div className="rtrack"></div>
              <div className="rseg" data-module="loop" role="button" tabIndex={0} aria-label="Agent loop — round 1" style={S({ "--w": "60px", "--d": "18px", "--h": "40px", left: "776px", top: "486px", transform: "translateZ(50px)" })}>
                <span className="cap"><span className="rseg-label">R1</span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="rseg" data-module="loop" role="button" tabIndex={0} aria-label="Agent loop — round 2" style={S({ "--w": "60px", "--d": "18px", "--h": "40px", left: "688px", top: "682px", transform: "translateZ(0px)" })}>
                <span className="cap"><span className="rseg-label">R2</span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="rseg" data-module="loop" role="button" tabIndex={0} aria-label="Agent loop — round 3" style={S({ "--w": "60px", "--d": "18px", "--h": "40px", left: "500px", top: "758px", transform: "translateZ(50px)" })}>
                <span className="cap"><span className="rseg-label">R3</span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="rseg" data-module="loop" role="button" tabIndex={0} aria-label="Agent loop — round 4" style={S({ "--w": "60px", "--d": "18px", "--h": "40px", left: "312px", top: "682px", transform: "translateZ(0px)" })}>
                <span className="cap"><span className="rseg-label">R4</span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="rseg" data-module="loop" role="button" tabIndex={0} aria-label="Agent loop — round 5" style={S({ "--w": "60px", "--d": "18px", "--h": "40px", left: "224px", top: "486px", transform: "translateZ(50px)" })}>
                <span className="cap"><span className="rseg-label">R5</span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="rseg" data-module="loop" role="button" tabIndex={0} aria-label="Agent loop — round 6" style={S({ "--w": "60px", "--d": "18px", "--h": "40px", left: "312px", top: "292px", transform: "translateZ(0px)" })}>
                <span className="cap"><span className="rseg-label">R6</span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="rseg" data-module="loop" role="button" tabIndex={0} aria-label="Agent loop — round 7" style={S({ "--w": "60px", "--d": "18px", "--h": "40px", left: "500px", top: "218px", transform: "translateZ(50px)" })}>
                <span className="cap"><span className="rseg-label">R7</span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="rseg" data-module="loop" role="button" tabIndex={0} aria-label="Agent loop — round 8" style={S({ "--w": "60px", "--d": "18px", "--h": "40px", left: "688px", top: "292px", transform: "translateZ(0px)" })}>
                <span className="cap"><span className="rseg-label">R8</span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="rglow"></div>

              <div className="mtrack"></div>
              <div className="mseg" data-module="transform" role="button" tabIndex={0} aria-label="Transform pipeline" style={S({ "--w": "90px", "--d": "16px", "--h": "12px", left: "716px", top: "488px", transform: "translateZ(0px)" })}>
                <span className="cap"></span><i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="mseg" data-module="transform" role="button" tabIndex={0} aria-label="Transform pipeline" style={S({ "--w": "90px", "--d": "16px", "--h": "12px", left: "668px", top: "700px", transform: "translateZ(0px)" })}>
                <span className="cap"></span><i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="mseg" data-module="transform" role="button" tabIndex={0} aria-label="Transform pipeline" style={S({ "--w": "90px", "--d": "16px", "--h": "12px", left: "500px", top: "744px", transform: "translateZ(0px)" })}>
                <span className="cap"></span><i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="mseg twist" data-module="transform" role="button" tabIndex={0} aria-label="Transform pipeline — parseltongue encoder" style={S({ "--w": "90px", "--d": "16px", "--h": "14px", left: "310px", top: "700px", transform: "translateZ(5px)" })}>
                <span className="cap"><span className="twist-seam"></span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="mseg" data-module="transform" role="button" tabIndex={0} aria-label="Transform pipeline" style={S({ "--w": "90px", "--d": "16px", "--h": "12px", left: "280px", top: "490px", transform: "translateZ(0px)" })}>
                <span className="cap"></span><i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="mseg" data-module="transform" role="button" tabIndex={0} aria-label="Transform pipeline" style={S({ "--w": "90px", "--d": "16px", "--h": "12px", left: "500px", top: "240px", transform: "translateZ(0px)" })}>
                <span className="cap"></span><i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="mglow"></div>
              <div className="mglow mglow-2"></div>

              <div className="pstep" data-module="ladder" role="button" tabIndex={0} aria-label="Escalation ladder — level 1" style={S({ "--w": "56px", "--d": "50px", "--h": "16px", left: "660px", top: "256px", transform: "translateZ(0px)" })}>
                <span className="cap"><span className="step-edge"></span><span className="pstep-label">L1</span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="pstep" data-module="ladder" role="button" tabIndex={0} aria-label="Escalation ladder — level 2" style={S({ "--w": "56px", "--d": "50px", "--h": "16px", left: "716px", top: "200px", transform: "translateZ(40px)" })}>
                <span className="cap"><span className="step-edge"></span><span className="pstep-label">L2</span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="pstep" data-module="ladder" role="button" tabIndex={0} aria-label="Escalation ladder — level 3" style={S({ "--w": "56px", "--d": "50px", "--h": "16px", left: "660px", top: "144px", transform: "translateZ(80px)" })}>
                <span className="cap"><span className="step-edge"></span><span className="pstep-label">L3</span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>
              <div className="pstep" data-module="ladder" role="button" tabIndex={0} aria-label="Escalation ladder — level 4" style={S({ "--w": "56px", "--d": "50px", "--h": "16px", left: "604px", top: "200px", transform: "translateZ(120px)" })}>
                <span className="cap"><span className="step-edge"></span><span className="pstep-label">L4</span></span>
                <i className="north"></i><i className="south"></i><i className="west"></i><i className="east"></i>
              </div>

              <div className="p spire-stack glow" data-module="findings" role="button" tabIndex={0} aria-label="Findings spire — signed session logs">
                <i className="c"></i><i className="n"></i><i className="s"></i><i className="w"></i><i className="e"></i>
              </div>
              <div className="ant-ring" style={S({ left: "472px", top: "466px", transform: "translateZ(30px)" })}></div>
              <div className="ant-ring" style={S({ left: "474px", top: "446px", transform: "translateZ(60px)" })}></div>
              <div className="spire-tip"></div>
              <div className="spire-glow"></div>

              <div className="darm" style={S({ left: "660px", top: "560px", width: "170px", transform: "translateZ(30px) rotate(-15deg)" })}>
                <div className="preset-rack" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
                <div className="module-pod" data-module="payload" role="button" tabIndex={0} aria-label="Payload foundry — preset arsenal"><span className="pod-core"></span></div>
              </div>
              <div className="darm" style={S({ left: "600px", top: "620px", width: "150px", transform: "translateZ(18px) rotate(38deg)" })}>
                <div className="campaign-barrel" aria-hidden="true"></div>
                <div className="module-pod" data-module="campaign" role="button" tabIndex={0} aria-label="Campaign battery — sweeps and grids"><span className="pod-core"></span></div>
              </div>
              <div className="darm" style={S({ left: "230px", top: "600px", width: "150px", transform: "translateZ(18px) rotate(142deg)" })}>
                <div className="dish" aria-hidden="true"></div>
                <div className="module-pod" data-module="corpus" role="button" tabIndex={0} aria-label="Corpus array — persona and jailbreak libraries"><span className="pod-core"></span></div>
              </div>
              <div className="darm" style={S({ left: "290px", top: "550px", width: "170px", transform: "translateZ(30px) rotate(-165deg)" })}>
                <div className="mcp-dome" aria-hidden="true"></div>
                <div className="module-pod" data-module="mcp" role="button" tabIndex={0} aria-label="MCP relay — wallbreaker as a tool server"><span className="pod-core"></span></div>
              </div>

              <div className="judge-orbit">
                <div className="judge" id="judge" data-module="judge" role="button" tabIndex={0} aria-label="The judge — independent LLM scoring"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="hud">
          <div className="hud-brand">
            <b><span className="dia">◆</span><span className="wall">WALL</span><span className="breaker">BREAKER</span></b>
            <span className="sys">AGENTIC RED-TEAM HARNESS</span>
          </div>
          <div className="hud-status">
            <a className="gh-link" href="https://github.com/JailbrokenAI/wallbreaker" target="_blank" rel="noopener noreferrer" aria-label="Wallbreaker on GitHub" title="GitHub — JailbrokenAI/wallbreaker">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg>
            </a>
            <span className="status-pill" id="statusPill">
              <span className="dot">
                <span className="dot-ping"></span>
                <span className="dot-core"></span>
              </span>
              <span id="engageState">ENGAGEMENT_ACTIVE</span>
            </span>
          </div>
          <nav className="hud-rail" aria-label="Engagement phases">
            <span className="sec on">RECON</span>
            <span className="sec">PAYLOAD</span>
            <span className="sec">ENGAGE</span>
            <span className="sec">REPORT</span>
            <div className="hud-reads">
              <span className="r">PRESETS<em>51</em></span>
              <span className="r">TRANSFORMS<em>222</em></span>
              <span className="r">TOOLS<em>100+</em></span>
              <span className="r">BEHAVIORS<em>400</em></span>
            </div>
          </nav>
          <div className="hud-head">
            <span className="sys">AUTHORIZED_TARGETS_ONLY</span>
            <h1>break the <span className="hl-cycle">wall</span> ·<br />not the rules of engagement<span className="hl-cycle">.</span></h1>
            <p>An agentic LLM red-team harness — autonomous tool-calling loops that probe, attack, and evaluate model safety boundaries. Every finding lands in an Ed25519-signed, auditable log.</p>
          </div>
          <div className="ecosystem">
            <span className="label">Targets by provider</span>
            <div className="logos">
              <span className="logo-pill">OPENAI</span>
              <span className="logo-pill">ANTHROPIC</span>
              <span className="logo-pill">OPENROUTER</span>
              <span className="logo-pill">Z.AI</span>
              <span className="logo-pill">XAI</span>
              <span className="logo-pill">CLAUDE_CODE</span>
            </div>
            <span className="stat">7 provider profiles · signed JSONL evidence</span>
          </div>
          <div className="hud-log" id="log">
            <div><span className="t">00:00:00.000</span>engagement engine online — clock locked</div>
            <div><span className="t">00:00:01.500</span>agent ring sync @ 1 beat</div>
            <div id="cursorline"><span className="cursor"></span></div>
          </div>
          <div className="hud-cta">
            <button className="btn btn-ghost" id="exploreBtn">Explore the Engine</button>
            <a className="btn btn-primary" href="/docs/getting-started/installation">Read the Docs</a>
            <a className="btn btn-gem" href="/break-the-wall" title="break the wall — not the rules of engagement">break the wall — not the rules of engagement</a>
          </div>
        </div>

        <div className="module-tip" id="tooltip">
          <span className="tip-tag"></span>
          <div className="tip-title"></div>
          <div className="tip-body"></div>
        </div>

        <div className="modal-overlay" id="modal" role="dialog" aria-modal="true" aria-hidden="true">
          <div className="modal">
            <button className="modal-close" aria-label="Close">&times;</button>
            <span className="modal-tag"></span>
            <h3></h3>
            <p></p>
            <ul className="feat-list"></ul>
            <a className="modal-link" href="#">Open in the docs →</a>
          </div>
        </div>
      </main>
    </div>
  );
}
