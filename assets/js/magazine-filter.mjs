export const normalise = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
export function filterIssues(items, filters = {}) {
  const words = normalise(filters.q).trim().split(/\s+/).filter(Boolean);
  return items
    .filter((item) => {
      const search = normalise(
        `${item.text} ${item.date} ${item.volume} ${item.number}`,
      );
      const month = item.date.slice(0, 7);
      return (
        words.every((word) => search.includes(word)) &&
        (!filters.from || month >= filters.from) &&
        (!filters.to || month <= filters.to) &&
        ["year", "volume", "number", "format"].every(
          (field) =>
            !filters[field] ||
            String(field === "year" ? item.date.slice(0, 4) : item[field]) ===
              String(filters[field]),
        )
      );
    })
    .sort(
      (a, b) =>
        (filters.sort === "oldest"
          ? a.date.localeCompare(b.date)
          : filters.sort === "volume"
            ? a.volume - b.volume || a.number - b.number
            : filters.sort === "number"
              ? a.number - b.number || a.date.localeCompare(b.date)
              : b.date.localeCompare(a.date)) || a.url.localeCompare(b.url),
    );
}
