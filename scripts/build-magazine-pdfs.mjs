// Build-time only: render the same HTML and print styles readers use.
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import http from "node:http";
import { spawn } from "node:child_process";
const root = path.resolve("public");
async function walk(dir) {
  return (
    await Promise.all(
      (await fs.readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name),
      ),
    )
  ).flat();
}
const issues = new Map();
for (const file of (await walk(root)).filter(
  (f) => path.basename(f) === "archive.json",
)) {
  for (const issue of JSON.parse(await fs.readFile(file, "utf8")).issues ||
    []) {
    if (issue.generate_pdf) issues.set(issue.pdf, issue);
  }
}
if (!issues.size) process.exit(0);
const candidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
let executable;
for (const candidate of candidates) {
  try {
    await fs.access(candidate, fs.constants.X_OK);
    executable = candidate;
    break;
  } catch {}
}
if (!executable)
  throw new Error(
    "PDF generation requires Chrome/Chromium. Install it or set CHROME_BIN to the executable. Use npm start for HTML development.",
  );
function localPath(url) {
  const result = path.resolve(
    root,
    "." + decodeURIComponent(new URL(url, "http://localhost").pathname),
  );
  if (!result.startsWith(root + path.sep))
    throw new Error("Invalid publication path");
  return result;
}
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
};
const server = http.createServer(async (req, res) => {
  try {
    let file = localPath(req.url);
    if ((await fs.stat(file)).isDirectory())
      file = path.join(file, "index.html");
    res.setHeader(
      "Content-Type",
      mime[path.extname(file)] || "application/octet-stream",
    );
    res.end(await fs.readFile(file));
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});
const base = `http://127.0.0.1:${server.address().port}`;
const profile = await fs.mkdtemp(path.join(os.tmpdir(), "nfb-pdf-"));
let browser, ws;
const pending = new Map();
let seq = 0;
try {
  browser = spawn(
    executable,
    [
      "--headless",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  const endpoint = await new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(
      () => reject(new Error("Chrome startup timed out")),
      30000,
    );
    browser.once("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    browser.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited (${code}): ${output}`));
    });
    browser.stderr.on("data", (chunk) => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
  });
  const address = new URL(endpoint);
  const tabs = await (await fetch(`http://${address.host}/json/list`)).json();
  ws = new WebSocket(tabs.find((t) => t.type === "page").webSocketDebuggerUrl);
  ws.onmessage = (event) => {
    const m = JSON.parse(event.data);
    if (m.id) {
      const p = pending.get(m.id);
      pending.delete(m.id);
      m.error
        ? p?.reject(new Error(JSON.stringify(m.error)))
        : p?.resolve(m.result);
    }
  };
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++seq;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, 30000);
      pending.set(id, {
        resolve: (r) => {
          clearTimeout(timer);
          resolve(r);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  await send("Page.enable");
  for (const issue of issues.values()) {
    await send("Page.navigate", { url: base + issue.url });
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      const result = await send("Runtime.evaluate", {
        expression: `location.pathname === ${JSON.stringify(new URL(issue.url, base).pathname)} && document.readyState === 'complete' && !!document.querySelector('.magazine-paper')`,
        returnByValue: true,
      });
      if (result.result.value) {
        ready = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!ready) throw new Error(`Issue did not load: ${issue.url}`);
    const prepared = await send("Runtime.evaluate", {
      awaitPromise: true,
      expression: `(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode();}));const canonical=document.querySelector('link[rel=canonical]').href;for(const a of document.querySelectorAll('a[href]')){const raw=a.getAttribute('href');if(raw.startsWith('#'))continue;if(a.origin===location.origin)a.href=new URL(a.pathname+a.search+a.hash,canonical).href;}return true;})()`,
    });
    if (prepared.exceptionDetails)
      throw new Error(`Issue assets failed: ${issue.url}`);
    const pdf = await send("Page.printToPDF", {
      printBackground: true,
      preferCSSPageSize: true,
      generateTaggedPDF: true,
      generateDocumentOutline: true,
      displayHeaderFooter: false,
    });
    await fs.writeFile(localPath(issue.pdf), Buffer.from(pdf.data, "base64"));
    console.log(`PDF: ${issue.pdf}`);
  }
} finally {
  ws?.close();
  if (browser?.pid && browser.exitCode === null) {
    const exited = new Promise((resolve) => browser.once("exit", resolve));
    browser.kill();
    await exited;
  }
  await new Promise((resolve) => server.close(resolve));
  await fs.rm(profile, { recursive: true, force: true, maxRetries: 3 });
}
