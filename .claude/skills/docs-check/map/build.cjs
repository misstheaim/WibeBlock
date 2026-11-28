// Assembles the WibeBlock docs map page: every doc's text, its links, and the rules from the data file.
// It checks nothing: the findings are written by Claude into findings.json, which the page loads at runtime.
// Run from anywhere inside the repo:
//   node .claude/skills/docs-check/map/build.cjs [--data <data.cjs>] [--out <page.html>]
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const repo = execSync("git rev-parse --show-toplevel").toString().trim();
const home = process.env.USERPROFILE || process.env.HOME;
const projDir = path.join(
  home,
  ".claude",
  "projects",
  path.resolve(repo).replace(/[^A-Za-z0-9]/g, "-"),
);
const dataFile = path.resolve(
  arg("--data") || path.join(projDir, "docs-map", "data.cjs"),
);
const out = path.resolve(
  arg("--out") || path.join(os.tmpdir(), "wibeblock-docs-map.html"),
);
const { META, RULES, TOPICS, PLAN_TRIGGER, SKILLS } = require(dataFile);

// ---- the docs: personal files Claude loads here, every .md in the repo (tracked or new), memory
const docs = [];
const add = (id, abs) =>
  docs.push({
    id,
    content: fs.readFileSync(abs, "utf8").replace(/\r\n/g, "\n"),
  });
add("~/.claude/CLAUDE.md", path.join(home, ".claude", "CLAUDE.md"));
for (const sid of Object.values(SKILLS))
  if (sid.startsWith("~/")) add(sid, path.join(home, sid.slice(2)));
const files = execSync("git ls-files --cached --others --exclude-standard", {
  cwd: repo,
})
  .toString()
  .split(/\r?\n/)
  .filter((f) => /\.md$/i.test(f) || f === "docs/plan/visual/plan-map.html");
for (const f of files)
  if (fs.existsSync(path.join(repo, f))) add(f, path.join(repo, f));
const memDir = path.join(projDir, "memory");
for (const f of fs.readdirSync(memDir).filter((n) => n.endsWith(".md")))
  add("memory/" + f, path.join(memDir, f));
const byId = new Map(docs.map((d) => [d.id, d]));

// ---- checkpoint: a content hash per doc, so the next run knows what changed. It compares; it judges nothing.
//   --changes      lists the docs changed, added or removed since the last checkpoint, and accepted items whose docs changed
//   --checkpoint   records the current state (run it after a successful publish)
const checkpointFile = path.join(path.dirname(dataFile), "checkpoint.json");
const findingsFile = path.join(path.dirname(dataFile), "findings.json");
if (
  process.argv.includes("--changes") ||
  process.argv.includes("--checkpoint")
) {
  const crypto = require("crypto");
  const hash = (s) =>
    crypto.createHash("sha1").update(s).digest("hex").slice(0, 12);
  const now = Object.fromEntries(docs.map((d) => [d.id, hash(d.content)]));
  const cp = fs.existsSync(checkpointFile)
    ? JSON.parse(fs.readFileSync(checkpointFile, "utf8"))
    : null;
  if (process.argv.includes("--changes")) {
    if (!cp) {
      console.log("No checkpoint yet: read everything.");
      process.exit(0);
    }
    const changed = Object.keys(now).filter(
      (id) => cp.docs[id] && cp.docs[id] !== now[id],
    );
    const added = Object.keys(now).filter((id) => !cp.docs[id]);
    const removed = Object.keys(cp.docs).filter((id) => !now[id]);
    console.log(
      `Checkpoint ${cp.at}${cp.commit ? ` at commit ${cp.commit.slice(0, 7)}` : ""}: ${changed.length} changed, ${added.length} new, ${removed.length} removed, of ${docs.length} docs.`,
    );
    for (const id of changed) console.log("changed  " + id);
    for (const id of added) console.log("new      " + id);
    for (const id of removed) console.log("removed  " + id);
    for (const [item, hs] of Object.entries(cp.accepted || {})) {
      const moved = Object.keys(hs).filter((id) => now[id] !== hs[id]);
      if (moved.length)
        console.log(
          `reopen   ${item}: ${moved.join(", ")} changed since it was accepted`,
        );
    }
    process.exit(0);
  }
  // accepted items keep the hashes from when they were accepted; newly accepted ones take today's
  const f = fs.existsSync(findingsFile)
    ? JSON.parse(fs.readFileSync(findingsFile, "utf8"))
    : {};
  const accepted = {};
  for (const a of f.accepted || []) {
    const ids = (a.docs || []).filter((id) => now[id]);
    accepted[a.id] =
      cp?.accepted?.[a.id] ||
      Object.fromEntries(ids.map((id) => [id, now[id]]));
  }
  let commit = null;
  try {
    commit = execSync("git rev-parse HEAD", { cwd: repo }).toString().trim();
  } catch {}
  fs.writeFileSync(
    checkpointFile,
    JSON.stringify(
      { at: new Date().toISOString(), commit, docs: now, accepted },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `Checkpoint written: ${docs.length} docs, ${Object.keys(accepted).length} accepted items, commit ${commit ? commit.slice(0, 7) : "none"}.`,
  );
  process.exit(0);
}

// ---- titles, descriptions and load classes; plan docs describe themselves
const plain = (s) =>
  s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*|__|`/g, "")
    .replace(/\s+/g, " ")
    .trim();
const firstSentences = (s, max = 230) => {
  s = plain(s);
  let cut = "";
  for (const part of s.split(/(?<=[.!?])\s+(?=[A-Z(])/)) {
    if ((cut + " " + part).trim().length > max && cut) break;
    cut = (cut + " " + part).trim();
    if (cut.length > 120) break;
  }
  return cut.length > max ? cut.slice(0, max - 1).trimEnd() + "…" : cut;
};
const section = (md, name) => {
  const m = md.match(
    new RegExp("^##\\s+" + name + "\\s*\\n+([\\s\\S]*?)(?=\\n##\\s|$)", "m"),
  );
  return m
    ? m[1]
        .split(/\n\n/)
        .find((p) => p.trim() && !p.startsWith("|") && !p.startsWith("```")) ||
        ""
    : "";
};
for (const d of docs) {
  const md = d.content;
  const meta = META[d.id] || {};
  const h1 = (md.match(/^#\s+(.+)$/m) || [])[1] || "";
  d.name = d.id.split("/").pop();
  d.size = md.length;
  d.lang = d.id.endsWith(".html") ? "html" : "md";
  Object.assign(d, {
    title: meta.title,
    desc: meta.desc,
    load: meta.load,
    trigger: meta.trigger,
  });
  let m;
  if ((m = d.id.match(/^docs\/plan\/parts\/([^/]+)\/\1\.md$/))) {
    Object.assign(d, {
      kind: "part",
      part: m[1],
      title: h1.replace(/^Part\s+—\s+/, ""),
    });
    d.desc = firstSentences((md.match(/^>\s*(.+)$/m) || [])[1] || "");
  } else if (
    (m = d.id.match(/^docs\/plan\/parts\/([^/]+)\/([^/]+)\/\2\.md$/))
  ) {
    Object.assign(d, {
      kind: "feature",
      part: m[1],
      feature: m[2],
      title: h1.replace(/^Feature\s+—\s+/, ""),
    });
    d.desc = firstSentences(section(md, "Purpose"));
    const head = (md.match(/^>.*Epics:\s*([^·\n]+)/m) || [])[1] || "";
    d.epicList = head
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (
    (m = d.id.match(
      /^docs\/plan\/parts\/([^/]+)\/([^/]+)\/epics\/(([A-Z])-\d+)-.+\.md$/,
    ))
  ) {
    Object.assign(d, {
      kind: "epic",
      part: m[1],
      feature: m[2],
      epic: m[3],
      title: h1.replace(/^[A-Z]-\d+\s+—\s+/, ""),
    });
    d.desc = firstSentences(section(md, "Goal"));
    const head = (md.match(/^>\s*(.+)$/m) || [])[1] || "";
    d.status = ((head.match(/Status:\s*([a-z ]+)/) || [])[1] || "draft").trim();
    d.head = plain(head);
  } else if (d.id.startsWith("memory/") && d.id !== "memory/MEMORY.md") {
    d.kind = "memory";
    d.load = d.load || "recall";
    d.desc = (md.match(/^description:\s*"?(.*?)"?\s*$/m) || [])[1];
    d.trigger =
      meta.trigger ||
      "When relevant: Claude reads it from the MEMORY.md pointer";
  } else d.kind = "doc";
  if (["part", "feature", "epic"].includes(d.kind))
    Object.assign(d, { load: "rule", trigger: PLAN_TRIGGER });
  if (!d.load)
    Object.assign(d, { load: "manual", trigger: "Only when opened" });
  d.title = (d.title || h1 || d.name).replace(/`/g, "");
  d.desc = d.desc || "";
}

// ---- links between docs: Markdown links, `path.md` mentions, [[memory]] links, skill names
const slashIds = docs
  .map((d) => d.id)
  .filter(
    (i) => i.includes("/") && !i.startsWith("~") && !i.startsWith("memory/"),
  );
const norm = (p) => path.posix.normalize(p).replace(/^\.\//, "");
for (const d of docs) {
  const set = new Set();
  const dir = d.id.startsWith("~") ? "" : path.posix.dirname(d.id);
  const tryAdd = (raw) => {
    if (!raw || /^[a-z]+:/i.test(raw) || raw.startsWith("#")) return;
    const p = raw.split("#")[0];
    for (const cand of [
      norm(path.posix.join(dir === "." ? "" : dir, p)),
      norm(p),
    ])
      if (byId.has(cand) && cand !== d.id) return void set.add(cand);
  };
  const md = d.lang === "md" ? d.content : "";
  for (const m of md.matchAll(/\]\(([^)\s]+)\)/g)) tryAdd(m[1]);
  for (const m of md.matchAll(/`([^`\s]+\.(?:md|html))`/g)) tryAdd(m[1]);
  for (const m of md.matchAll(/\[\[([\w-]+)\]\]/g))
    tryAdd("memory/" + m[1] + ".md");
  for (const s of slashIds) if (md && s !== d.id && md.includes(s)) set.add(s);
  for (const [n, sid] of Object.entries(SKILLS))
    if (
      sid !== d.id &&
      byId.has(sid) &&
      new RegExp(String.raw`(^|[^\w-])/?` + n + String.raw`(?![\w-])`).test(md)
    )
      set.add(sid);
  if (d.id === "docs/plan/visual/plan-map.html")
    set.add("docs/plan/00-master.md");
  d.links = [...set];
}

// ---- every decision becomes a rule of decisions.md
const decRules = [];
for (const m of byId
  .get("docs/plan/decisions.md")
  .content.matchAll(/^## (D-\d+) (.+)\n([\s\S]*?)(?=\n## |$)/gm)) {
  const decision = (m[3].match(/\*\*Decision\.\*\*\s*([^\n]+)/) || [])[1] || "";
  const sup =
    (m[3].match(/\*\*(Partly )?[Ss]uperseded[^*]*\*\*[^\n]*/) || [])[0] || "";
  decRules.push({
    id: "dec-" + m[1],
    src: "docs/plan/decisions.md",
    topic: "decision",
    sec: m[1],
    t: m[1] + " " + plain(m[2]),
    d: firstSentences(decision, 420),
    sup: sup ? plain(sup) : "",
  });
}
const rules = [...RULES, ...decRules];
for (const r of rules)
  if (!byId.has(r.src)) throw new Error(`rule ${r.id}: no doc ${r.src}`);

const data = {
  docs,
  rules,
  topics: TOPICS,
  built: new Date().toISOString().slice(0, 10),
};
const BS = String.fromCharCode(92);
const json = JSON.stringify(data)
  .replace(/</g, BS + "u003c")
  .replace(new RegExp(String.fromCharCode(0x2028), "g"), BS + "u2028")
  .replace(new RegExp(String.fromCharCode(0x2029), "g"), BS + "u2029");
const tpl = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");
fs.writeFileSync(
  out,
  tpl.replace("__DATA__", () => json),
);
console.log(
  `Built ${out}: ${docs.length} docs, ${rules.length} rules, ${Math.round(fs.statSync(out).size / 1024)} KB`,
);
