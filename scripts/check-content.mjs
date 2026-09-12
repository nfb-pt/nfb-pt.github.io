import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
const languages = ["pt", "en"];
const entries = new Map();
const errors = [];
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
}
for (const lang of languages) {
  for (const file of walk(`content/${lang}`).filter((p) => p.endsWith(".md"))) {
    const raw = fs.readFileSync(file, "utf8");
    const front = raw.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!front) {
      errors.push(`${file}: missing front matter`);
      continue;
    }
    const data = YAML.parse(front[1]);
    if (data.draft) continue;
    if (!data.translationKey) errors.push(`${file}: missing translationKey`);
    const key = `${lang}:${data.translationKey}`;
    if (entries.has(key)) errors.push(`${file}: duplicate translationKey`);
    entries.set(key, file);
    if (data.image && !data.image_alt)
      errors.push(`${file}: image needs translated alt text`);
    if (data.demo && !data.noindex)
      errors.push(`${file}: DEMO must have noindex`);
    if (data.starts && Number.isNaN(Date.parse(data.starts)))
      errors.push(`${file}: invalid starts date`);
    if (
      data.ends &&
      (!data.starts || Date.parse(data.ends) < Date.parse(data.starts))
    )
      errors.push(`${file}: ends must follow starts`);
    if (
      data.download &&
      !fs.existsSync(path.join("static", data.download.replace(/^\//, "")))
    )
      errors.push(`${file}: missing download`);
  }
}
let missing = 0;
for (const [key, file] of entries) {
  const [lang, ...parts] = key.split(":");
  if (!entries.has(`${lang === "pt" ? "en" : "pt"}:${parts.join(":")}`)) {
    missing++;
    console.warn(`Translation missing: ${file}`);
  }
}
if (process.argv.includes("--strict-translations") && missing)
  errors.push(`${missing} missing translations`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `Content: ${entries.size} published source pages checked; ${missing} missing translations.`,
);
