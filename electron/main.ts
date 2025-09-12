import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { spawn } from "child_process"
import path from 'node:path'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    frame: false,
    autoHideMenuBar: true,
    width: 800,
    height: 600,
    transparent: true,
  })
  
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}
function hmsToSeconds(hms: string) {
  const [h, m, s] = hms.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

ipcMain.on('minimize-window', () => {
  const win = BrowserWindow.getFocusedWindow()
  win?.minimize()
})

ipcMain.on('close-window', () => {
  const win = BrowserWindow.getFocusedWindow()
  win?.close()
})

ipcMain.on("compress-video", (event, filePath: string, targetSize: number) => {
  const { spawn } = require("child_process");
  const path = require("node:path");

  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const dir = path.dirname(filePath);
  const outputFile = path.join(dir, `${base}_compressed${ext}`);

  const python = spawn("python", [
    path.join(__dirname, "../python/main.py"),
    filePath,
    outputFile,
    targetSize.toString(),
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
      const progress = (currentTime / duration) * 100;
      event.sender.send("compression-progress", { file: filePath, progress });
    }
  });

  python.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
    event.sender.send("compression-done", outputFile); 
  });
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
