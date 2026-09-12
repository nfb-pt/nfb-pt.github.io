// Isolated fixtures exercise future/past event grouping, pagination, missing translations,
// and real raster processing without publishing test content or editing the working content.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import YAML from "yaml";
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "nfb-features-"));
try {
  fs.cpSync("config", path.join(temp, "config"), { recursive: true });
  fs.cpSync("content", path.join(temp, "content"), { recursive: true });
  const languagesFile = path.join(temp, "config/_default/languages.yaml");
  const languages = YAML.parse(fs.readFileSync(languagesFile, "utf8"));
  for (const lang of ["pt", "en"])
    languages[lang].contentDir = path.join(temp, "content", lang);
  fs.writeFileSync(languagesFile, YAML.stringify(languages));
  function fixture(section, slug, data) {
    const folder = path.join(temp, "content/pt", section, slug);
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(
      path.join(folder, "index.md"),
      `---\n${YAML.stringify(data)}---\n\nConteúdo de teste isolado.\n`,
    );
    return folder;
  }
  const future = new Date(Date.now() + 86400000 * 30).toISOString();
  const past = new Date(Date.now() - 86400000 * 30).toISOString();
  fixture("atividades", "test-upcoming", {
    title: "TEST UPCOMING",
    translationKey: "test-upcoming",
    starts: future,
  });
  fixture("atividades", "test-past", {
    title: "TEST PAST",
    translationKey: "test-past",
    starts: past,
  });
  fixture("atividades", "test-undated", {
    title: "TEST UNDATED",
    translationKey: "test-undated",
  });
  for (let i = 0; i < 10; i++)
    fixture("noticias", `test-${i}`, {
      title: `TEST NEWS ${i}`,
      translationKey: `test-news-${i}`,
      date: past,
    });
  const imageFolder = fixture("exposicoes", "test-image", {
    title: "TEST IMAGE",
    translationKey: "test-image",
    image: "scan.png",
    image_alt: "Test scan",
  });
  fs.copyFileSync(
    "static/images/brand/nfb-social.png",
    path.join(imageFolder, "scan.png"),
  );
  fixture("publicacoes", "test-download", {
    title: "TEST DOWNLOAD",
    translationKey: "test-download",
    download: "documents/approved.pdf",
    year: 2026,
    issue: "1",
  });
  const result = spawnSync(
    process.execPath,
    [
      "scripts/hugo.mjs",
      "--configDir",
      path.join(temp, "config"),
      "--destination",
      path.join(temp, "public"),
    ],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const html = (url) =>
    fs.readFileSync(path.join(temp, "public", url, "index.html"), "utf8");
  const agenda = html("atividades");
  assert(
    agenda.indexOf("TEST UPCOMING") < agenda.indexOf("Atividades anteriores"),
  );
  assert(agenda.indexOf("TEST PAST") > agenda.indexOf("Atividades anteriores"));
  assert(agenda.indexOf("TEST UNDATED") > agenda.indexOf("Datas a anunciar"));
  const home = html("");
  assert(home.includes("TEST UPCOMING"));
  assert(!home.includes("TEST PAST"));
  assert(!home.includes("TEST UNDATED"));
  assert(html("noticias/page/2").includes("TEST NEWS"));
  const single = html("atividades/test-upcoming");
  assert.match(single, /<a[^>]+href=\/?en\/?[\s"'][^>]*lang=en/);
  const raster = html("exposicoes/test-image");
  assert(raster.includes("srcset="));
  assert(raster.includes(".webp"));
  assert(html("publicacoes/test-download").includes("/documents/approved.pdf"));
  console.log(
    "Feature fixtures passed: upcoming/past/undated events, homepage filtering, news pagination, missing-translation fallback, raster srcset and PDF link rendering.",
  );
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
