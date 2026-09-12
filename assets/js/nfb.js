const toggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nfb-nav");
if (toggle && navigation) {
  toggle.hidden = false;
  document.documentElement.classList.add("has-js");
  const close = () => { toggle.setAttribute("aria-expanded", "false"); navigation.classList.remove("is-open"); };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { close(); toggle.focus(); }
  });
  document.addEventListener("click", event => { if (!event.target.closest(".nfb-header")) close(); });
  matchMedia("(min-width: 1200px)").addEventListener("change", close);
}
