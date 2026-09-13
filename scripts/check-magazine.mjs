import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { filterIssues } from "../assets/js/magazine-filter.mjs";
const items = [
  {
    url: "/a/",
    date: "2021-03-01",
    volume: 6,
    number: 1,
    format: "scan",
    text: "Coleção de Braga. Maria. Correspondência.",
  },
  {
    url: "/b/",
    date: "2027-01-01",
    volume: 12,
    number: 2,
    format: "digital",
    text: "Poema sobre uma carta. José.",
  },
  {
    url: "/c/",
    date: "2027-03-01",
    volume: 12,
    number: 1,
    format: "digital",
    text: "Filatelia temática. Maria.",
  },
];
const urls = (filters) => filterIssues(items, filters).map((i) => i.url);
assert.deepEqual(urls({}), ["/c/", "/b/", "/a/"]);
assert.deepEqual(urls({ q: "COLECAO correspondencia" }), ["/a/"]);
assert.deepEqual(urls({ q: "maria", format: "digital" }), ["/c/"]);
assert.deepEqual(urls({ year: "2027", number: "1" }), ["/c/"]);
assert.deepEqual(urls({ volume: "6" }), ["/a/"]);
assert.deepEqual(urls({ from: "2027-01", to: "2027-01" }), ["/b/"]);
assert.deepEqual(urls({ sort: "oldest" }), ["/a/", "/b/", "/c/"]);
assert.deepEqual(urls({ sort: "volume" }), ["/a/", "/c/", "/b/"]);
assert.deepEqual(urls({ sort: "number" }), ["/a/", "/c/", "/b/"]);
assert.deepEqual(urls({ q: "inexistente" }), []);
assert.equal(items[0].url, "/a/", "Filtering must not mutate source order");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "nfb-issue-scaffold-"));
try {
  const script = path.resolve("scripts/new-issue.mjs");
  const create = (...args) =>
    spawnSync(
      process.execPath,
      [
        script,
        "--year",
        "2027",
        "--volume",
        "6",
        "--number",
        "1",
        "--date",
        "2027-03-01",
        ...args,
      ],
      { cwd: temp, encoding: "utf8" },
    );
  assert.equal(create().status, 0);
  const index = path.join(temp, "content/pt/edicoes/2027-1/index.md");
  const original = fs.readFileSync(index, "utf8");
  assert(original.includes("draft: true"));
  assert(original.includes("url: /a-pagina/2027/1/"));
  assert.equal(fs.readdirSync(path.dirname(index)).length, 9);
  assert.notEqual(create().status, 0, "Never overwrite an existing issue");
  assert.equal(fs.readFileSync(index, "utf8"), original);
  assert.equal(create("--lang", "en", "--format", "scan").status, 0);
  assert.equal(
    fs.readdirSync(path.join(temp, "content/en/issues/2027-1")).length,
    1,
  );
  assert.notEqual(create("--date", "2027-02-31").status, 0);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
console.log(
  "Magazine tests passed: full-text/accent/author search, combined date/year/volume/number/format filters, all sort orders, and safe digital/scan draft creation.",
);
