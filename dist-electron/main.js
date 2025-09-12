import { ipcMain, BrowserWindow, app } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require2 = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    },
    frame: false,
    autoHideMenuBar: true,
    width: 800,
    height: 600,
    transparent: true
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
function hmsToSeconds(hms) {
  const [h, m, s] = hms.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}
ipcMain.on("minimize-window", () => {
  const win2 = BrowserWindow.getFocusedWindow();
  win2 == null ? void 0 : win2.minimize();
});
ipcMain.on("close-window", () => {
  const win2 = BrowserWindow.getFocusedWindow();
  win2 == null ? void 0 : win2.close();
});
ipcMain.on("compress-video", (event, filePath, targetSize) => {
  const { spawn: spawn2 } = require2("child_process");
  const path2 = require2("node:path");
  const ext = path2.extname(filePath);
  const base = path2.basename(filePath, ext);
  const dir = path2.dirname(filePath);
  const outputFile = path2.join(dir, `${base}_compressed${ext}`);
  const python = spawn2("python", [
    path2.join(__dirname, "../python/main.py"),
    filePath,
    outputFile,
    targetSize.toString()
  ]);
  let duration = 0;
  python.stdout.on("data", (data) => {
    const message = data.toString().trim();
    if (message.startsWith("DURATION=")) {
      duration = parseFloat(message.split("=")[1]);
      event.sender.send("compression-duration", { file: filePath, duration });
    }
  });
  python.stderr.on("data", (data) => {
    const message = data.toString();
    const timeMatch = message.match(/time=(\d+:\d+:\d+\.\d+)/);
    if (timeMatch && duration > 0) {
      const currentTime = hmsToSeconds(timeMatch[1]);
      const progress = currentTime / duration * 100;
      event.sender.send("compression-progress", { file: filePath, progress });
    }
  });
  python.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
    event.sender.send("compression-done", outputFile);
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
