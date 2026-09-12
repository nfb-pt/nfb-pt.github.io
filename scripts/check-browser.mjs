// Start Chrome with --remote-debugging-port=9222 and serve public on port 4173.
// Run: node scripts/check-browser.mjs. Screenshots/results go to the OS temp directory.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
const base = process.env.NFB_TEST_URL || "http://127.0.0.1:4173";
const tabs = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const ws = new WebSocket(
  tabs.find((t) => t.type === "page").webSocketDebuggerUrl,
);
let seq = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const m = JSON.parse(event.data);
  if (m.id) {
    const p = pending.get(m.id);
    pending.delete(m.id);
    m.error ? p?.reject(m.error) : p?.resolve(m.result);
  }
};
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
};
const navigate = async (url) => {
  await send("Page.navigate", { url: base + url });
  await new Promise((r) => setTimeout(r, 350));
  await evaluate(
    `Promise.all([document.fonts.ready, ...[...document.images].map(i => {i.loading='eager'; return i.decode().catch(()=>{});})])`,
  );
};
const report = [];
try {
  await send("Page.enable");
  await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  for (const width of [320, 390, 768, 1200, 1366, 1920]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    for (const lang of ["pt", "en"]) {
      await navigate(lang === "pt" ? "/" : "/en/");
      const metrics = await evaluate(
        `({width:innerWidth,scroll:document.documentElement.scrollWidth,lang:document.documentElement.lang,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),cards:document.querySelectorAll('.nfb-card').length})`,
      );
      assert.equal(metrics.scroll, width, `Overflow at ${width}/${lang}`);
      assert.equal(
        metrics.broken.length,
        0,
        `Broken images ${JSON.stringify(metrics.broken)}`,
      );
      assert.equal(metrics.cards, 8);
      assert(
        await evaluate(
          `document.querySelector('#latest-blog').previousElementSibling.querySelector('h2').textContent.trim() === ${JSON.stringify(lang === "pt" ? "Notícias" : "News")}`,
        ),
      );
      assert(
        await evaluate(
          `document.querySelector('#latest-blog').nextElementSibling.classList.contains('agenda-section')`,
        ),
      );
      assert(
        await evaluate(
          `!!document.querySelector('.nfb-nav a[href="${lang === "pt" ? "/blogue/" : "/en/blog/"}"]')`,
        ),
      );
      report.push({ width, lang, ...metrics });
      if ([390, 1366].includes(width)) {
        const shot = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(
          path.join(os.tmpdir(), `nfb-${lang}-${width}.png`),
          Buffer.from(shot.data, "base64"),
        );
      }
    }
  }
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await navigate("/");
  // Real keyboard input, including Escape restoring focus to the toggle.
  await evaluate(`document.querySelector('.menu-toggle').focus()`);
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
    text: "\r",
    unmodifiedText: "\r",
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
  });
  assert.equal(
    await evaluate(
      `document.querySelector('.menu-toggle').getAttribute('aria-expanded')`,
    ),
    "true",
  );
  assert.equal(
    await evaluate(
      `getComputedStyle(document.querySelector('.nfb-nav')).display`,
    ),
    "block",
  );
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
    code: "Escape",
    windowsVirtualKeyCode: 27,
  });
  assert.equal(
    await evaluate(
      `document.querySelector('.menu-toggle').getAttribute('aria-expanded')`,
    ),
    "false",
  );
  assert.equal(
    await evaluate(`document.activeElement.className`),
    "menu-toggle",
  );
  for (const [url, translation] of [
    ["/sobre/historia/", "/en/about/history/"],
    ["/blogue/escolher-um-tema/", "/en/blog/choosing-a-theme/"],
    ["/en/exhibitions/sample-gallery/", "/exposicoes/galeria-demo/"],
  ]) {
    await navigate(url);
    assert(
      await evaluate(
        `!!document.querySelector('.nfb-languages a[href="${translation}"]')`,
      ),
    );
    assert.equal(await evaluate(`document.documentElement.scrollWidth`), 390);
  }
  for (const url of [
    "/blogue/",
    "/blogue/um-caderno-para-a-colecao/",
    "/en/blog/",
    "/autores/exemplo-a/",
    "/contactos/",
    "/atividades/",
    "/publicacoes/boletim-demo/",
    "/en/news/a-closer-look/",
  ]) {
    await navigate(url);
    assert.equal(await evaluate(`document.documentElement.scrollWidth`), 390);
  }
  await navigate("/blogue/um-caderno-para-a-colecao/");
  assert(await evaluate(`!!document.querySelector('.translation-note')`));
  assert.equal(
    await evaluate(
      `document.querySelector('.nfb-languages a[lang="en"]').pathname`,
    ),
    "/en/",
  );
  assert.equal(
    await evaluate(
      `document.querySelectorAll('link[rel="alternate"][hreflang="en"]').length`,
    ),
    0,
  );
  assert.equal(
    await evaluate(`document.querySelectorAll('a[rel="author"]').length`),
    2,
  );
  await navigate("/en/blog/");
  assert.equal(
    await evaluate(`document.querySelectorAll('.nfb-card').length`),
    2,
  );
  for (const [url, query, prefix] of [
    ["/pesquisa/", "coleção", "/"],
    ["/en/search/", "collection", "/en/"],
  ]) {
    await navigate(url);
    await evaluate(
      `{ const input=document.querySelector('.pagefind-ui__search-input'); input.value=${JSON.stringify(query)}; input.dispatchEvent(new Event('input',{bubbles:true})); }`,
    );
    let results = [];
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 150));
      results = await evaluate(
        `Array.from(document.querySelectorAll('.pagefind-ui__result-link'),a=>new URL(a.href).pathname)`,
      );
      if (results.length) break;
    }
    assert(results.length > 0, `No search results for ${query}`);
    assert(
      results.every((r) =>
        prefix === "/en/" ? r.startsWith(prefix) : !r.startsWith("/en/"),
      ),
      "Search leaked another language",
    );
    assert.equal(await evaluate(`document.documentElement.scrollWidth`), 390);
    report.push({ search: url, query, results });
  }
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  assert(
    await evaluate(`matchMedia('(prefers-reduced-motion: reduce)').matches`),
  );
  await send("Emulation.setEmulatedMedia", { features: [] });
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await navigate("/");
  const metrics = await send("Page.getLayoutMetrics");
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: 1440,
      height: metrics.cssContentSize.height,
      scale: 1,
    },
  });
  fs.writeFileSync(
    path.join(os.tmpdir(), "nfb-final-homepage.png"),
    Buffer.from(shot.data, "base64"),
  );
  fs.writeFileSync(
    path.join(os.tmpdir(), "nfb-browser-results.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  console.log(
    "Browser checks passed: responsive PT/EN, images, keyboard menu, equivalent language links, search isolation and reduced-motion emulation.",
  );
} finally {
  ws.close();
}
