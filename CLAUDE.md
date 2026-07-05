## gstack (REQUIRED — global install)

**Before doing ANY work, verify gstack is installed:**

```bash
test -d ~/.claude/skills/gstack/bin && echo "GSTACK_OK" || echo "GSTACK_MISSING"
```

If GSTACK_MISSING: STOP. Do not proceed. Tell the user:

> gstack is required for all AI-assisted work in this repo.
> Install it:
> ```bash
> git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
> cd ~/.claude/skills/gstack && ./setup --team
> ```
> Then restart your AI coding tool.

Do not skip skills, ignore gstack errors, or work around missing gstack.

Using gstack skills: After install, skills like /qa, /ship, /review, /investigate,
and /browse are available. Use /browse for all web browsing.
Use ~/.claude/skills/gstack/... for gstack file paths (the global path).

## GBrain Configuration (configured by /setup-gbrain)
- Mode: local-stdio
- Engine: pglite
- Config file: ~/.gbrain/config.json (mode 0600)
- Setup date: 2026-07-03
- MCP registered: yes (user scope)
- Embeddings: deferred (no API key yet — keyword search only; add a key + `gbrain config set embedding_model <id>` to enable semantic search)
- Artifacts sync: off
- Current repo policy: unset (no git remote yet)
- Note: gbrain binary at ~/.bun/bin/gbrain (PATH set in ~/.zprofile)

## GBrain Search Guidance (configured by /sync-gbrain)
<!-- gstack-gbrain-search-guidance:start -->

GBrain is set up on this machine (keyword search only until an embedding key
is added). Prefer `gbrain search "<terms>"` for recalling past plans, retros,
decisions, and hackathon context. Grep remains right for exact strings, regex,
and file globs in code. Run /sync-gbrain to index this repo's code.

<!-- gstack-gbrain-search-guidance:end -->

