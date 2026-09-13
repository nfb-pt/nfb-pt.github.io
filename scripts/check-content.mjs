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
    const relativePath = path
      .relative(path.join(contentRoot, lang), file)
      .split(path.sep);
    const isMagazine =
      relativePath[0] === (lang === "pt" ? "edicoes" : "issues") &&
      relativePath.length > 2;
    const isMagazineEntry = isMagazine && path.basename(file) !== "index.md";
    if (isMagazineEntry) {
      const parentFile = path.join(path.dirname(file), "index.md");
      const parent = YAML.parse(
        fs
          .readFileSync(parentFile, "utf8")
          .match(/^---\s*\n([\s\S]*?)\n---/)[1],
      );
      if (parent.draft) continue;
    }
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
    entries.set(key, {
      file,
      data,
      lang,
      isBlogArticle,
      isMagazine,
      isMagazineEntry,
    });
    if (isBlogArticle || isMagazineEntry) {
      if (isBlogArticle && (!data.date || Number.isNaN(Date.parse(data.date))))
        errors.push(`${file}: blog article needs a valid publication date`);
      if (
        !Array.isArray(data.authors) ||
        !data.authors.length ||
        data.authors.some((id) => typeof id !== "string" || !id)
      )
        errors.push(`${file}: article needs author IDs`);
      if (
        Array.isArray(data.authors) &&
        new Set(data.authors).size !== data.authors.length
      )
        errors.push(`${file}: duplicate author IDs`);
    }
    if (isMagazine && !isMagazineEntry) {
      for (const field of ["edition_year", "volume", "number"])
        if (!Number.isInteger(data[field]) || data[field] < 1)
          errors.push(`${file}: ${field} must be a positive integer`);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(data.issue_date || "") ||
        Number.isNaN(Date.parse(data.issue_date)) ||
        new Date(data.issue_date).toISOString().slice(0, 10) !== data.issue_date
      )
        errors.push(`${file}: invalid issue_date (YYYY-MM-DD required)`);
      if (
        data.url !==
        `${lang === "pt" ? "" : "/en"}/a-pagina/${data.edition_year}/${data.number}/`
      )
        errors.push(`${file}: issue URL must match edition_year/number`);
      if (
        data.magazine_id !== "a-pagina" ||
        !["digital", "scan"].includes(data.format)
      )
        errors.push(`${file}: invalid magazine_id or format`);
      if (data.generate_pdf && (data.pdf || data.format !== "digital"))
        errors.push(
          `${file}: generated PDF requires digital format without supplied pdf`,
        );
      if (data.format === "scan" && !data.pdf)
        errors.push(`${file}: scan needs a PDF in static/documents`);
      if (
        data.pdf &&
        (!/^documents\/[^.].*\.pdf$/.test(data.pdf) ||
          data.pdf.split("/").includes("..") ||
          !fs.existsSync(path.join("static", data.pdf)))
      )
        errors.push(`${file}: missing or invalid PDF`);
    }
    if (isMagazineEntry) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.anchor || ""))
        errors.push(`${file}: invalid entry anchor`);
      if (
        ![
          "editorial",
          "activities",
          "article",
          "members",
          "curiosity",
          "puzzle",
          "braga",
          "poem",
        ].includes(data.section)
      )
        errors.push(`${file}: invalid entry section`);
      if (!Number.isFinite(data.weight))
        errors.push(`${file}: entry needs a numeric weight`);
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
  const { file, data, lang, isBlogArticle, isMagazine, isMagazineEntry } =
    entry;
  if (
    isMagazine &&
    !isMagazineEntry &&
    [...entries.values()].filter(
      (e) =>
        e.lang === lang &&
        e.isMagazine &&
        !e.isMagazineEntry &&
        e.data.url === data.url,
    ).length > 1
  )
    errors.push(`${file}: duplicate issue URL`);
  if (
    isMagazineEntry &&
    [...entries.values()].filter(
      (e) =>
        e.isMagazineEntry &&
        path.dirname(e.file) === path.dirname(file) &&
        e.data.anchor === data.anchor,
    ).length > 1
  )
    errors.push(`${file}: duplicate entry anchor`);
  if (
    data.author_id &&
    profiles.filter(
      (p) => p.lang === lang && p.data.author_id === data.author_id,
    ).length !== 1
  )
    errors.push(`${file}: duplicate author_id`);
  if ((isBlogArticle || isMagazineEntry) && Array.isArray(data.authors)) {
    for (const id of data.authors)
      if (!profiles.some((p) => p.lang === lang && p.data.author_id === id))
        errors.push(`${file}: missing author profile ${id} in ${lang}`);
  }
  const otherKey = `${lang === "pt" ? "en" : "pt"}:${data.translationKey}`;
  if (!entries.has(otherKey)) {
    if (isBlogArticle || isMagazine) {
      untranslatedBlog++;
      console.log(`Editorial translation optional: ${file}`);
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
  `Content: ${entries.size} published source pages checked; ${missing} missing required translations; ${untranslatedBlog} editorial sources without a translation.`,
);
