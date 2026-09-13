import { filterIssues } from "./magazine-filter.mjs";
const form = document.querySelector("[data-archive-form]");
if (form) {
  const list = document.querySelector("[data-issue-list]");
  try {
    const response = await fetch(form.dataset.index);
    if (!response.ok) throw new Error("Archive index unavailable");
    const { issues } = await response.json();
    const items = issues
      .map((issue) => ({
        ...issue,
        element: [...list.children].find(
          (el) => el.dataset.issueUrl === issue.url,
        ),
      }))
      .filter((issue) => issue.element);
    for (const field of ["year", "volume", "number", "format"]) {
      const values = [
        ...new Set(
          items.map((item) =>
            field === "year" ? item.date.slice(0, 4) : String(item[field]),
          ),
        ),
      ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      for (const value of values) {
        const label =
          field === "format"
            ? form.querySelector(`[data-format-${value}]`)?.textContent || value
            : value;
        form.elements[field].add(new Option(label, value));
      }
    }
    const update = () => {
      const visible = filterIssues(
        items,
        Object.fromEntries(new FormData(form)),
      );
      items.forEach((item) => {
        item.element.hidden = true;
      });
      visible.forEach((item) => {
        item.element.hidden = false;
        list.append(item.element);
      });
      form.querySelector("[data-archive-count]").textContent =
        form.dataset.count.replace("{count}", String(visible.length));
      document.querySelector("[data-archive-empty]").hidden =
        visible.length > 0;
    };
    form.hidden = false;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      update();
    });
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("reset", () => setTimeout(update, 0));
    update();
  } catch {
    document.querySelector("[data-archive-error]").hidden = false;
  }
}
