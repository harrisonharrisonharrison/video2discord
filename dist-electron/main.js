import { ipcMain, BrowserWindow, app } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { spawn } from "child_process";
import path from "node:path";
createRequire(import.meta.url);
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
ipcMain.on("minimize-window", () => {
  const win2 = BrowserWindow.getFocusedWindow();
  win2 == null ? void 0 : win2.minimize();
});
ipcMain.on("close-window", () => {
  const win2 = BrowserWindow.getFocusedWindow();
  win2 == null ? void 0 : win2.close();
});
ipcMain.on("compress-video", (event, filePath, targetSize) => {
  const outputFile = filePath.replace(/\.mp4$/, "_compressed.mp4");
  const python = spawn("python", [
    path.join(__dirname, "../python/main.py"),
    filePath,
    outputFile,
    targetSize.toString()
  ]);
  python.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    lines.forEach((line) => {
      if (line.startsWith("PROGRESS:")) {
        const progress = parseFloat(line.replace("PROGRESS:", ""));
        event.sender.send("compression-progress", progress);
      }
    });
  });
  python.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
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
