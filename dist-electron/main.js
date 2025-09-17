import { ipcMain as d, BrowserWindow as u, shell as I, app as a } from "electron";
import { createRequire as P } from "node:module";
import { fileURLToPath as S } from "node:url";
import s from "node:path";
import O from "fs";
const g = P(import.meta.url), l = s.dirname(S(import.meta.url));
process.env.APP_ROOT = s.join(l, "..");
const f = process.env.VITE_DEV_SERVER_URL, W = s.join(process.env.APP_ROOT, "dist-electron"), T = s.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = f ? s.join(process.env.APP_ROOT, "public") : T;
let n;
function E() {
  n = new u({
    icon: s.join(l, "/favicon.ico"),
    webPreferences: {
      preload: s.join(l, "preload.mjs")
    },
    frame: !1,
    autoHideMenuBar: !0,
    width: 800,
    height: 600,
    transparent: !0
  }), n.webContents.on("did-finish-load", () => {
    n == null || n.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), f ? n.loadURL(f) : n.loadFile(s.join(T, "index.html"));
}
function D(e) {
  const [o, r, p] = e.split(":").map(Number);
  return o * 3600 + r * 60 + p;
}
d.on("minimize-window", () => {
  const e = u.getFocusedWindow();
  e == null || e.minimize();
});
d.on("close-window", () => {
  const e = u.getFocusedWindow();
  e == null || e.close();
});
d.handle("check-file-exists", (e, o) => O.existsSync(o));
d.handle("open-in-explorer", async (e, o) => {
  try {
    return await I.showItemInFolder(o), !0;
  } catch (r) {
    return console.error("Failed to open in explorer:", r), !1;
  }
});
d.on("compress-video", (e, o, r) => {
  const { spawn: p } = g("child_process"), i = g("node:path"), _ = i.extname(o), j = i.basename(o, _), x = i.dirname(o), h = i.join(x, `${j}_compressed${_}`), v = !a.isPackaged;
  let c;
  if (v)
    c = p("python", [
      i.join(l, "../python/main.py"),
      o,
      h,
      r.toString()
    ]);
  else {
    const t = i.join(process.resourcesPath, "python", "main.exe");
    c = p(t, [o, h, r.toString()]);
  }
  let m = 0;
  c.stdout.on("data", (t) => {
    const w = t.toString().trim();
    w.startsWith("DURATION=") && (m = parseFloat(w.split("=")[1]), e.sender.send("compression-duration", { file: o, duration: m }));
  }), c.stderr.on("data", (t) => {
    const R = t.toString().match(/time=(\d+:\d+:\d+\.\d+)/);
    if (R && m > 0) {
      const y = D(R[1]) / m * 100;
      e.sender.send("compression-progress", { file: o, progress: y });
    }
  }), c.on("close", (t) => {
    console.log(`Python process exited with code ${t}`), e.sender.send("compression-done", { outputPath: h });
  });
});
a.on("window-all-closed", () => {
  process.platform !== "darwin" && (a.quit(), n = null);
});
a.on("activate", () => {
  u.getAllWindows().length === 0 && E();
});
a.whenReady().then(E);
export {
  W as MAIN_DIST,
  T as RENDERER_DIST,
  f as VITE_DEV_SERVER_URL
};
