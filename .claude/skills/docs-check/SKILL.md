---
name: docs-check
description: WibeBlock only. Claude applies the owner's notes from the WibeBlock Docs Map, re-reads every doc that shapes a session here (both CLAUDE.md files, memory, skills, docs/, the plan, readmes), lists where they conflict, and republishes the map for the owner to review. Use when the owner types /docs-check, usually after a big docs change or after reviewing the map.
argument-hint: "[what changed, optional]"
disable-model-invocation: true
---

# Docs check

The **WibeBlock Docs Map** (https://claude.ai/artifact/CGotLoVZC1juTA1VB6YoSb) shows every doc, the rules it gives Claude, and a list of findings. A red badge on a doc or rule opens one window with the conflicting parts side by side. You find the conflicts by reading the docs; no script checks anything. The owner reviews the list on the page: they tick items, write in each one's note what you should do, and remove the ticked items that need nothing. The page saves all of this in `findings.json`, published next to it.

Arguments: `$ARGUMENTS` (what changed, to look at first). Empty means check everything.

## Files

- `map/template.html` and `map/build.cjs` (this folder): the page. The build only assembles it from the docs and the data file.
- `~/.claude/projects/C--Users-User-Documents-Projects-WibeBlock/docs-map/` holds the data. It is kept out of the repo, which is public, because the data summarises the owner's personal files.
  - `findings.json`: your copy of the list. The page edits its own copy, so read that one back first.
  - `data.cjs`: what each doc is and when it loads (`META`), and the rules each doc gives Claude (`RULES`).

## 1. Read the page's list

Read the live list: Artifact `read` with the URL above and `path: "findings.json"`.

- An item's `note` is the owner's instruction for it.
- Items that are in your local copy but missing from the live list were removed by the owner because they need nothing. Add them to `accepted`.

## 2. Apply the notes

Do what each note says: edit the docs it names (memory included), or move the item to `accepted` when the note says to keep things as they are. If a note is unclear, or you think it would make things worse, ask the owner before acting. Anything the owner says in the chat counts as a note too.

## 3. Read and judge

Read every doc the map holds: `~/.claude/CLAUDE.md`, `CLAUDE.md`, the memory files, the project skills and the personal ones in `SKILLS`, `docs/development.md`, `docs/conventions.md`, the ticket and epic templates, the master plan, `decisions.md`, every part, feature and epic doc, the readmes and `packages/ui/TOKENS.md`. Where a doc states a fact, check it against the code, git and GitHub (routes, scripts, closed issues). These checks are read-only.

- **conflict**: two parts give contradictory instructions or facts. Each side is `outdated`, `current`, or `says` when neither one wins. Conflicts get the red badges.
- **override**: a narrower rule wins on purpose (the project over the global rules, memory over a skill). Its sides are `rule` and `wins`.
- **gap**: a doc no rule points to.

These are not findings: IDEA.md vs the plan (history), superseded decisions marked as such, planned epics without files, and wording.

## 4. Write the list

`findings.json` is `{ "updated", "items": [...], "accepted": [...] }`.

- An item has `id`, `kind`, `title` (the claim, short), `text` (what disagrees and why, 1–3 sentences), `fix` (the smallest edit that resolves it) and `sides` (`doc`, `quote`, `role`). It may also have `rules` (rule ids involved; `dec-D-nn` for decisions), `also` (related docs) and `note`.
- An id is `C`, `O` or `G` plus a number. Keep existing ids, number new items after the highest one, and never reuse an id.
- A `quote` is exact text from its doc, or a list of quotes. Copy it as it reads rendered (no `**` or backticks); for `plan-map.html`, copy the raw source. The page marks the quote in the doc.
- Drop the items you resolved in step 2. Keep a `note` only on an item you could not resolve yet, and say why in its `text`.
- `accepted` holds `{ id, title }` for items the owner keeps as they are. Don't raise them again while those docs stay the same.

Update `RULES` and `META` in `data.cjs` where the docs changed.

## 5. Build and publish

1. Run `node .claude/skills/docs-check/map/build.cjs --out <scratchpad>/docs-map.html`.
2. Publish with the Artifact tool: `url` from above, `file_path` the built page, `files: {"findings.json": "<a copy of the local findings.json in the scratchpad>"}`. Leave out `capabilities`: the page keeps `{artifact: {}}`, which lets it save its list. Typing `/docs-check` is the request to republish this artifact; nothing else outside the machine changes.
3. Expect a refusal: every note the owner saves on the page publishes a new version, and reading `findings.json` with `path` doesn't count as viewing it.
   1. When the publish is refused because "a newer version … is live", read the live `findings.json` again and compare it with the one from step 1. Merge any note or removal the owner made since (a removal goes to `accepted`), and rewrite the scratchpad copy.
   2. Read only the last 10 lines of the saved source file the refusal names (`offset` near its end, `limit: 10`; never the whole file). This makes that version count as viewed. The page itself is unchanged there: the page only ever saves `findings.json`.
   3. Publish again with the same arguments.
   4. If that is refused as "identical content … resent unchanged", publish once more, unchanged. If the owner saved again in between, repeat this step. Never pass `force`, which would throw away their newest notes.

## 6. Report

In a few lines: which notes you applied and what changed, what is new on the list and what is gone. Ask the owner to review the map, write their notes, and run `/docs-check` again when done. If repo files changed, end with the session-end git block.
