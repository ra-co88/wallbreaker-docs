# Docs-Site Correction Tasks — from the 2026-08-31 Content Audit

**Source:** [AUDIT-2026-08-31-content.md](AUDIT-2026-08-31-content.md)
**Working copy:** `/Users/rna/wallbreaker-docs` · **Ground truth:** `/Users/rna/Desktop/TRIANGLE/wallbreaker` @ `34c5a48` (== origin/main)
**Executor note:** every fix below is derivable from the **public repo alone** (code, `config.example.toml`, CHANGELOG, docs/SETUP.md). No `.agents/` content is needed or wanted in the site. A fresh agent with only the public checkout can execute all of it.
**Global scope guard:** no mention of papers, the triangle projects, strix, or DispatchLayer — anywhere, in any task.

**Verification commands (run after edits):**

```bash
cd /Users/rna/wallbreaker-docs && npm run build        # MDX + TS must pass
# against the wallbreaker repo, for claim checks:
cd /Users/rna/Desktop/TRIANGLE/wallbreaker
python3 -c "import ast;print(len([1]))"               # spot tools: see task T5
# command-parity check: every CLI line shown in docs must appear in
# wallbreaker/cli.py SUBCOMMANDS / flags, or be a real TUI slash command in tui/app.py
```

---

## Phase 1 — Critical (site is wrong in ways that break users)

### [ ] T1 · Fix the install extras (site breaks on step 1)
- **Files:** `content/index.mdx` (Terminal quickstart), `content/getting-started/installation.mdx` (Clone & Install)
- **Problem:** `pip install -e ".[dashboard,agents,all]"` — `agents` and `all` extras don't exist (`pyproject.toml` extras: `dev, barcodes, stego, dashboard`).
- **Fix:** replace with:
  ```bash
  pip install -e ".[dashboard,barcodes,stego]"
  ```
  (Installation page may show the CLI-only minimal path `pip install -e .` first, then extras as an optional line.)
- **Accept:** a clean clone + the documented command installs without pip's "unknown extra" warning; `wallbreaker check` runs.

### [ ] T2 · Correct the judge verdict bands (all three boundaries wrong)
- **Files:** `content/guides/reliability.mdx` (The LLM Judge table), `content/glossary.mdx` (Judge + Verdict entries), `content/concepts/engagement.mdx` (score-meaning table)
- **Problem:** docs say COMPLIED 8–10 / PARTIAL 5–7 / REFUSED 0–4. Code (`wallbreaker/judging.py` `score_to_label`): **REFUSED 0–2, PARTIAL 3–5, COMPLIED 6–10**; judge prompt text confirms ("defensive-only rewrite … 3-5 PARTIAL. Reserve 6-8/9-10").
- **Fix:** update all three pages to the 0–2 / 3–5 / 6–10 bands.
- **Accept:** bands match `score_to_label` everywhere; grep for `8-10|5-7|0-4` in `content/` returns nothing.

### [ ] T3 · Rebuild `configuration.mdx` TOML from `config.example.toml`
- **Files:** `content/getting-started/configuration.mdx`
- **Problem:** `[target]` example uses `provider = "openai"` (fails validation — endpoints need `protocol`/`base_url`/`api_key_env`/`model`; `provider` is the OpenRouter backend-pin only); `[agents]` documented as `max_iterations` (real `[agents]` = role assignment); `[agent_profiles.default] temperature` wrong shape (real: `[agent_profiles.<role>."name"]` with `prompt_source = "none"|"inline"|"file"`); profiles taught with literal `api_key` instead of `api_key_env`; MCP example has a nonexistent `transport` field (real `MCPServer` fields: `name/command/args/env/enabled/tool_prefix`).
- **Fix:** replace each TOML block with the corresponding block from `config.example.toml` (openrouter + zai + claude-code profiles; `[target]` with `protocol/base_url/api_key_env/model` + commented `timeout/reasoning/system_mode/modality/provider-pin`; `[agents.attacker|target|judge]`; one `agent_profiles` example; `[[mcp.servers]]` verbatim). Keep the page's field tables but re-key them to the real field names.
- **Accept:** pasting each block into a fresh `config.toml` passes `wallbreaker check`.

### [ ] T4 · Remove fabricated CLI invocations
- **Files:** `content/getting-started/first-session.mdx` (Headless / CI), `content/concepts/sessions-findings.mdx` (Verify, Report & Export)
- **Problem:** `wallbreaker run --config config.toml --preset harmful_basic` — no `run` subcommand, no `harmful_basic` preset (real subcommands: `lib parsel eni transform findings report export check regrade baseline dashboard`). `wallbreaker verify --findings …` — no `verify` subcommand. `report --input runs/latest.jsonl --format html` and `export --input … --format csv` — real flags are a **positional log** + `--html` + `--out`; export emits **JSON**, no CSV.
- **Fix:** first-session headless block → `wallbreaker --auto --rounds 3 "objective"` (mirror `scripting.mdx`, which is correct). sessions-findings → `wallbreaker report sessions/run-<ts>.jsonl --html --out report.html`, `wallbreaker export sessions/run-<ts>.jsonl --out findings.json`. For the signed log, either drop the example or describe the feature without inventing a CLI ("findings are appended to an Ed25519-signed JSONL log; verification via the `findings` CLI and `regrade`").
- **Accept:** every CLI line in these two pages parses against `cli.py` (subcommands + flags); no `harmful_basic`, no `--input`, no `--format` in `content/`.

---

## Phase 2 — High (structural gaps / wrong instructions)

### [ ] T5 · Repair the broken tool rows and re-verify the tool count
- **Files:** `content/reference/tools.mdx`, `content/reference/_meta.ts`, `content/index.mdx` (StatCard), `content/glossary.mdx` (Tool Registry entry if counts appear)
- **Problem:** "Personas & Narratives" contains three broken template rows `_get` / `_list` / `_search` (unsubstituted f-strings; note the double space in "from  by"). They are the generated corpus tools from `tools/gemlib.py` (`for corpus in ("zetalib", "ultrabreaks")` → `f"{corpus}_{get|list|search}"`).
- **Fix:** replace with six real rows: `zetalib_get`, `zetalib_list`, `zetalib_search`, `ultrabreaks_get`, `ultrabreaks_list`, `ultrabreaks_search` (descriptions from `gemlib.py`). Then derive the true registered-tool count from a live run (`/tools` in the TUI, or the WebUI V2 Arsenal) and reconcile the "104 tools" claims (Callout, `_meta.ts` "Tools (104)", index StatCard) — static scan says 104 named + 6 generated; use the live number.
- **Accept:** no row names starting with `_`; count identical in Callout, sidebar `_meta.ts`, and index StatCard; count matches a live `/tools` listing.

### [ ] T6 · Correct tool parameters in guides
- **Files:** `content/guides/campaigns.mdx`, `content/guides/reliability.mdx` (validate table)
- **Problem (code truth in parentheses):**
  - `campaign` docs list `max_techniques=6`, `concurrent=4` → real: `category`, `source` (`harmbench|jbb|strongreject|advbench`), `behaviors`, `n`, `ladder` (`tools/campaign.py`)
  - `grid_sweep` example uses `techniques=[…]` → real: `ladder` (plus `categories`, `n`, `source`, `behaviors`)
  - `transfer_sweep` example uses `target_change=…` → real: `harm_tag`, `limit`, `max_calls`, `concurrency` (`tools/transfer_sweep.py`)
  - `leaderboard` example uses `profiles=[…]` → real: `behaviors`, `category`, `n`, `cross_family`; also the example value `"z-ai"` is not a profile name (config defines `zai`)
  - `validate` table lists a `transforms` param → real: `task`/`prompt`, `system`, `n` (min 2, default 8), `temperature`, `max_tokens`, `objective`, `timeout` (`tools/validate.py`)
- **Fix:** update tables and Terminal examples to the real signatures; fix `z-ai` → `zai`.
- **Accept:** every parameter name in these two pages exists in the corresponding tool's `parameters=` schema.

### [ ] T7 · Remove the phantom `max_iterations`
- **Files:** `content/concepts/agent-loop.mdx` (Exit Conditions, Concurrency table), `content/getting-started/first-session.mdx` (if referenced)
- **Problem:** `max_iterations` exists nowhere in the code.
- **Fix:** Exit conditions → `finish()`, `ask_operator()` (TUI), agent-loop cap (**25**, `agent/loop.py` `max_iters`), one-shot `--rounds` (default **12**, `cli.py`), Ctrl+C. Note T3 already fixes the Configuration page's copy.
- **Accept:** `grep -rn max_iterations content/` is empty; the real caps are cited.

### [ ] T8 · Document WebUI V2 (the current release's flagship)
- **Files:** new `content/getting-started/webui-v2.mdx` (+ `getting-started/_meta.ts` entry, above legacy); rewrite `content/getting-started/webui.mdx` as the legacy page; update `content/index.mdx` card grid; expand the `glossary.mdx` WebUI V2 entry to link the new page
- **Content (all public-repo facts: CHANGELOG "Unreleased — WebUI V2", `dashboard/server.py`, `docs/SETUP.md`):** launch (`wallbreaker dashboard`), `/v2` vs `/legacy`; token auth at launch (`require_auth=True` default; token printed + written to a token file; frontend uses `X-WB-Token`); queued **executions** with pause / resume / steering / attacker switching / cancellation / reconnectable sequenced events; canonical JSONL history + rebuildable SQLite search-correlation index; surfaces: Agent, Live (historical-run selection, drafts/view state preserved), Runs explorer, Workflow Studio (sequencing + reconstruction), cross-run findings, run-log exploration, evidence reports, provider verification, profile management; typed capability catalog (TUI is source of truth — `capabilities.py`); pointer to `docs/SETUP.md`.
- **Fix for legacy page:** retitle "Legacy Dashboard", keep the three existing screenshots, add a banner pointing to V2.
- **Accept:** new page renders (`npm run build`), linked from `_meta.ts`, index, and glossary; auth documented; legacy page clearly marked.

### [ ] T9 · Document Wallbreaker as an MCP server (`wb_*` tools)
- **Files:** new `content/reference/mcp-server.mdx` (+ `reference/_meta.ts`); update `glossary.mdx` MCP entry ("client **and** server"); cross-link from `configuration.mdx`'s MCP section
- **Content (public: `wallbreaker_mcp/`, `scripts/smoke_mcp.sh`, `docs/mcp_client_config.json`, CHANGELOG section):** four tools over stdio JSON-RPC — `wb_attack` (`objective`, `target_model`, `max_rounds` 1–10, `dataset` harmbench/advbench/jbb; graceful error dict without `OPENAI_API_KEY`), `wb_judge` (score ∈ [0,1], `compliant` iff ≥ 0.7), `wb_seed_list` (categories incl. static fallback: cybercrime / jailbreak_universal / context_escape × 10), `wb_generate_payloads` (`source` gem/harmbench/advbench/dispatch_library); run via `python -m wallbreaker_mcp`; client config template (`docs/mcp_client_config.json`) for Claude Code / Cursor / Windsurf / Gemini CLI / Codex; smoke test `scripts/smoke_mcp.sh` (6 checks, exit 0/1). Do **not** confuse this server with the client-side `[[mcp.servers]]` block (link both directions).
- **Accept:** new page builds + linked; glossary updated; both directions of the client/server distinction stated.

### [ ] T10 · Fix the tool-registration example in Contributing
- **Files:** `content/contributing.mdx` (Adding a New Tool)
- **Problem:** example uses `registry.register(Tool(...))` — `ToolRegistry` has **no** `register()` method; tools call `registry.add(name=…, description=…, parameters=…, handler=…)` (`tools/registry.py`), and modules expose `register(registry)` (that part is right).
- **Fix:** correct the code sample to `registry.add(...)`; keep the "module tuple in `tools/__init__.py`" step (real) and the "local ToolRegistry in tests" house rule (real).
- **Accept:** copy-pasted example matches `registry.add`'s signature; "72 modules define `register()`" style claims stay consistent.

---

## Phase 3 — Medium (quality / completeness)

### [ ] T11 · One canonical state-files table
- **Files:** `content/getting-started/configuration.mdx` (replace its wrong table), `content/concepts/sessions-findings.mdx`, `content/policies/security.mdx`, `content/guides/scripting.mdx` (keep as the reference copy)
- **Problem:** `configuration.mdx` claims run logs live in `runs/`; code truth is `sessions/run-<timestamp>.jsonl` + `sessions/autosave.json`; `wb_runs/` holds engagement artifacts (not run logs); findings dirs per `.gitignore`: `wb_runs/ wb_images/ wb_artifacts/ findings/ sessions/` (+ `library/` at runtime, gitignored corpora).
- **Fix:** single table (path → contents → gitignored?) in one page (suggest `scripting.mdx` or `security.mdx`), all others link to it.
- **Accept:** no page says `runs/` for run logs; table matches `.gitignore` exactly.

### [ ] T12 · Disambiguate 71 vs 222 transforms
- **Files:** `content/reference/transforms.mdx` (Callout), `content/index.mdx` (StatCard label), `content/glossary.mdx` (Parseltongue + P4RS3LT0NGV3 entries)
- **Fix:** one clarifying sentence: 71 **native** Wallbreaker transforms (`wallbreaker/transforms/`, documented on this page) vs the **222-transform** P4RS3LT0NGV3 catalog (11 categories) behind the `parsel_*` tools / MCP engine. StatCard → "71 native transforms".
- **Accept:** both numbers appear only with their qualifier.

### [ ] T13 · Fix the HarmBench category table
- **Files:** `content/policies/methodology.mdx` (§1 table)
- **Problem:** lists "Violence / Sexual content / General violations" — not real categories. Truth (and already correct in `tools.mdx`'s harmbench row): `chemical_biological`, `cybercrime_intrusion`, `illegal`, `misinformation_disinformation`, `harmful`, `harassment_bullying`, `copyright`.
- **Fix:** align the table with the seven real semantic categories (note "400 behaviors" stays).
- **Accept:** methodology + tools.mdx agree; categories match HarmBench.

### [ ] T14 · Add a compact CLI reference page
- **Files:** new `content/reference/cli.mdx` (+ `reference/_meta.ts`)
- **Content (from `cli.py`):** one-shot/TUI flags (`--config --profile --base-url --model --protocol --api-key-env --api-key --no-tools --system --auto --rounds --target --target-model --target-modality --resume` + positional prompt); subcommands with flags: `findings`, `report [log] [--html] [--out]`, `export [log] [--out] [--fail-on-finding]` (exit 2 = CI gate), `check [--config]`, `regrade [log]`, `baseline save|compare` (ASR-regression gate), `corpus verify [--update]` (library.lock.toml integrity), `lib update|list|path`, `parsel update|list|path`, `eni …`, `transform`, `dashboard [--sessions]`. Cross-link from `scripting.mdx`.
- **Accept:** every listed flag exists in `cli.py`; page linked from scripting + sidebar.

### [ ] T15 · Document the dataset sources beyond HarmBench
- **Files:** `content/guides/campaigns.mdx` (campaign/grid_sweep sections), `content/policies/methodology.mdx` (§1)
- **Fix:** one sentence + param: `source = harmbench | jbb | strongreject | advbench` (default harmbench); methodology reworded to "standardized batteries (HarmBench by default; JBB, StrongREJECT, AdvBench supported)".
- **Accept:** `source` appears wherever `category`/`behaviors` params are shown.

### [ ] T16 · Security page: document shipped hardening
- **Files:** `content/policies/security.mdx`, `content/getting-started/webui-v2.mdx` (from T8)
- **Fix:** add paragraphs for: dashboard auth (`require_auth=True` default, launch token, `X-WB-Token`); SSRF egress pinning (pinned transport / `egress_guard`, socket-IP pinning); tool policy layer (`tool_policy`); corpus integrity (`corpus verify` + `library.lock.toml`); Ed25519 signed findings log (exists in security already — keep, and link the CLI from T14).
- **Accept:** security.mdx mentions auth + egress + tool policy; no contradiction with webui pages.

### [ ] T17 · Small correctness fixes batch
- **Files/details:**
  - `content/guides/scripting.mdx`: repair broken YAML interpolation `OPENROUTER_API_KEY: *** secrets.OPENROUTER_API_KEY }}` → `${{ secrets.OPENROUTER_API_KEY }}`; also the example workflow lives at `.github/workflows/redteam-gate.example.yml` (page says `.example.yml` — verify name matches repo: repo has both `redteam-gate.yml` and `redteam-gate.example.yml`; document the example one).
  - `content/guides/payloads.mdx`: remove the `/preset search <keyword>` promise (`_cmd_preset` supports bare / `list` only).
  - `content/getting-started/configuration.mdx`: honor `presets.mdx`'s "see Configuration" cross-link — document external presets dir discovery (`presets/` in cwd, `WALLBREAKER_PRESETS_DIR`) with a TOML example.
  - `content/glossary.mdx`: add `zai`/`zai-openai`/xAI mention consistency (see T20).
- **Accept:** build passes; no phantom subcommands; cross-link resolves.

### [ ] T18 · Add Troubleshooting + change-history convention
- **Files:** new `content/guides/troubleshooting.mdx` (+ `_meta.ts`); all pages get `last_updated` frontmatter
- **Content seeds (from audit evidence):** pip unknown-extra → T1 fix; `wallbreaker check` config errors (protocol/base_url/api_key_env missing); judge scoring surprises (bands + `judge_selftest`); corpus-dependent test failures offline (pre-existing set, `xfail`); OpenRouter variance (pin `provider`, use `validate`); dashboard token/auth issues; HarmBench not cached offline.
- **Fix:** add `last_updated: YYYY-MM-DD` to every page's frontmatter going forward (rubric: missing change-history = High on the standard rubric).
- **Accept:** troubleshooting page linked; frontmatter present on all content pages.

---

## Phase 4 — Low (polish)

### [ ] T19 · Unify the reliability threshold
- **Files:** `content/guides/reliability.mdx`, `content/policies/responsible-use.mdx`, `content/glossary.mdx` (ASR entry)
- **Problem:** docs say "75%+ on 8 samples"; the tool's own verdict line is `RELIABLE if rate >= 70` (`tools/validate.py`).
- **Fix:** pick one narrative — recommend: "the tool flags ≥70% as RELIABLE; responsible disclosure bar: validate with n≥8 and report the measured rate" — and use it consistently.

### [ ] T20 · Complete the provider/profile table
- **Files:** `content/concepts/engagement.mdx`, `content/glossary.mdx` (Profile)
- **Fix:** add `zai` (Anthropic protocol @ api.z.ai), `zai-openai` (OpenAI protocol), `xai` (native, `XAI_API_KEY`) alongside openai/anthropic/openrouter/claude-code; note protocol semantics (`protocol`, not `provider`, selects the wire format).

### [ ] T21 · Remaining nits
- `content/getting-started/installation.mdx`: reword the Python-3.11 note (repo floor is 3.11 per `pyproject.toml`; the old f-string incompatibility is fixed upstream).
- `content/getting-started/configuration.mdx`: drop `transport` from the MCP example (covered by T3 if done together).
- `content/policies/security.mdx`: verify the `.wallbreaker_state.json` gitignore claim against `.gitignore`; correct or remove.
- `content/guides/campaigns.mdx` (Optimizing Templates): example says `optimize with template=…` → tool name is `optimize_universal`.
- `content/guides/personas.mdx` (editorial, operator's call): worked example uses a hard-harm objective; consider a lock-picking/web-scraping-class example that carries the same instructional weight.

---

## Definition of done (whole effort)

1. `npm run build` passes with zero MDX/TS errors.
2. Every CLI line in `content/` parses against `wallbreaker/cli.py`; every slash command exists in `tui/app.py`; every tool row exists in the registry; every tool parameter exists in that tool's `parameters=` schema.
3. Judge bands, extras, state-file paths, and category lists match code/repo exactly (grep checks from T2/T4/T7/T11/T13 all clean).
4. New pages (webui-v2, mcp-server, cli, troubleshooting) are reachable from the sidebar `_meta.ts` files and cross-linked.
5. `grep -rniE "triangle|strix|dispatchlayer|orion" content/` stays empty.
6. Suggested commit sequencing: one commit per phase (Critical / High / Medium / Low), each listing the task IDs closed.

**Effort sketch:** T1–T4 ≈ half a session (mechanical, high value). T8–T9 are the two real writing tasks (new pages). T10–T18 mechanical-to-moderate. T19–T21 minutes.
