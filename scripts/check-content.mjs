import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
const languages = ["pt", "en"];
const entries = new Map();
const contentFlag = process.argv.indexOf("--content-dir");
const contentRoot =
  contentFlag === -1 ? "content" : process.argv[contentFlag + 1];
const errors = [];
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
}
for (const lang of languages) {
  for (const file of walk(path.join(contentRoot, lang)).filter((p) =>
    p.endsWith(".md"),
  )) {
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
    const relative = path
      .relative(path.join(contentRoot, lang), file)
      .split(path.sep);
    const isBlogArticle =
      relative[0] === (lang === "pt" ? "blogue" : "blog") &&
      path.basename(file) !== "_index.md";
    entries.set(key, { file, data, lang, isBlogArticle });
    if (isBlogArticle) {
      if (!data.date || Number.isNaN(Date.parse(data.date)))
        errors.push(`${file}: blog article needs a valid publication date`);
      if (
        !Array.isArray(data.authors) ||
        !data.authors.length ||
        data.authors.some((id) => typeof id !== "string" || !id)
      )
        errors.push(`${file}: blog article needs author IDs`);
      if (
        Array.isArray(data.authors) &&
        new Set(data.authors).size !== data.authors.length
      )
        errors.push(`${file}: duplicate author IDs`);
    }
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
let untranslatedBlog = 0;
const profiles = [...entries.values()].filter(({ data }) => data.author_id);
for (const entry of entries.values()) {
  const { file, data, lang, isBlogArticle } = entry;
  if (
    data.author_id &&
    profiles.filter(
      (p) => p.lang === lang && p.data.author_id === data.author_id,
    ).length !== 1
  )
    errors.push(`${file}: duplicate author_id`);
  if (isBlogArticle && Array.isArray(data.authors)) {
    for (const id of data.authors)
      if (!profiles.some((p) => p.lang === lang && p.data.author_id === id))
        errors.push(`${file}: missing author profile ${id} in ${lang}`);
  }
  const otherKey = `${lang === "pt" ? "en" : "pt"}:${data.translationKey}`;
  if (!entries.has(otherKey)) {
    if (isBlogArticle) {
      untranslatedBlog++;
      console.log(`Blog translation optional: ${file}`);
    } else {
      missing++;
      console.warn(`Translation missing: ${file}`);
    }
  }
}
if (process.argv.includes("--strict-translations") && missing)
  errors.push(`${missing} missing required translations`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `Content: ${entries.size} published source pages checked; ${missing} missing required translations; ${untranslatedBlog} blog articles without a translation.`,
);
