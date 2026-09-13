import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .reduce(
      (pairs, value, index, all) =>
        index % 2 === 0
          ? [...pairs, [value.replace(/^--/, ""), all[index + 1]]]
          : pairs,
      [],
    ),
);
const { year, volume, number, date, lang = "pt", format = "digital" } = args;
if (
  !/^\d{4}$/.test(year || "") ||
  !/^[1-9]\d*$/.test(volume || "") ||
  !/^[1-9]\d*$/.test(number || "") ||
  !/^\d{4}-\d{2}-\d{2}$/.test(date || "") ||
  Number.isNaN(Date.parse(date)) ||
  new Date(date).toISOString().slice(0, 10) !== date ||
  !["pt", "en"].includes(lang) ||
  !["digital", "scan"].includes(format)
) {
  console.error(
    "Usage: npm run issue:new -- --year 2027 --volume 6 --number 1 --date 2027-03-01 [--lang pt|en] [--format digital|scan]",
  );
  process.exit(1);
}
const pt = lang === "pt";
const folder = path.join(
  "content",
  lang,
  pt ? "edicoes" : "issues",
  `${year}-${number}`,
);
if (fs.existsSync(folder)) throw new Error(`Already exists: ${folder}`);
fs.mkdirSync(folder, { recursive: true });
const write = (name, data, body) =>
  fs.writeFileSync(
    path.join(folder, name),
    `---\n${YAML.stringify(data)}---\n\n${body}\n`,
  );
write(
  "index.md",
  {
    title: `A Página do NFB — ${pt ? "número" : "issue"} ${number}/${year}`,
    translationKey: `a-pagina-${year}-${number}`,
    type: "magazine",
    magazine_id: "a-pagina",
    url: `${pt ? "" : "/en"}/a-pagina/${year}/${number}/`,
    edition_year: Number(year),
    issue_date: date,
    volume: Number(volume),
    number: Number(number),
    format,
    draft: true,
    ...(format === "digital" ? { generate_pdf: true } : { pdf: "" }),
    description: "[A COMPLETAR]",
    coverline: "[A COMPLETAR]",
    editorial_notes:
      "[A COMPLETAR] — Confirmar metadados, autoria, direitos e texto antes de publicar.",
  },
  pt
    ? "[A COMPLETAR] — Apresentação da edição. Para digitalizações, acrescentar aqui uma transcrição revista (OCR) para pesquisa."
    : "[A COMPLETAR] — Issue introduction. For scans, add a reviewed transcription (OCR) here to enable search.",
);
if (format === "digital") {
  const sections = [
    ["editorial", "editorial", "Editorial", "Editorial"],
    ["atividades", "activities", "Atividades", "Activities"],
    ["artigo", "article", "Artigo", "Article"],
    ["socios", "members", "Informações para os sócios", "Member notices"],
    ["curiosidades", "curiosity", "Curiosidades", "Curiosities"],
    ["passatempos", "puzzle", "Passatempos", "Puzzles"],
    ["braga", "braga", "Braga", "Braga"],
    ["poema", "poem", "Poema", "Poem"],
  ];
  sections.forEach(([anchor, section, ptTitle, enTitle], i) =>
    write(
      `${anchor}.md`,
      {
        title: pt ? ptTitle : enTitle,
        translationKey: `a-pagina-${year}-${number}-${anchor}`,
        anchor,
        section,
        authors: [],
        weight: (i + 1) * 10,
      },
      "[A COMPLETAR]",
    ),
  );
}
console.log(
  `Draft created: ${folder}. Complete the text and author IDs before removing draft: true. Use the same year/number with --lang ${pt ? "en" : "pt"} to add a translation.`,
);
