import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";
const windows: BrowserWindow[] = [];
const NUMBER_OF_WINDOWS = 3; // Replace this with the actual number of windows
const videoIds = [
  "IqMxc5K4PxA",
  "WowxMDK-SMc",
  "IqMxc5K4PxA",
  // Add more video IDs as needed
];
const width = 600;
const height = 400;

function getRandomVideoId() {
  const randomIndex = Math.floor(Math.random() * videoIds.length);
  return videoIds[randomIndex];
}

ipcMain.handle("open-windows", (_, windowNumber) => {
  for (let i = 0; i < windowNumber; i++) {
    // Create and open the windows here
    // Use the same logic as before
  }
});

function createWindow() {
  const rendererConfigs = [
    { url: "html/index.html", name: "Renderer index" },
    { url: "html/1.html", name: "Renderer 1" },
    { url: "html/2.html", name: "Renderer 2" },
  ];

  for (let i = 0; i < NUMBER_OF_WINDOWS; i++) {
    const config = rendererConfigs[i];
    const win = new BrowserWindow({
      width: width,
      height: height,
      webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"), // Create this file (see explanation below)
        sandbox: true, // Add this line to enable the sandbox mode
      },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      win.loadURL(`${process.env.VITE_DEV_SERVER_URL}/${config.url}`);
    } else {
      win.loadFile(path.join(__dirname, `../dist/${config.url}`));
    }

    if (i !== 0) {
      win.webContents.on("did-finish-load", () => {
        const videoId = getRandomVideoId();
        win.webContents.executeJavaScript(`
          const iframe = document.createElement('iframe');
          iframe.src = 'https://www.youtube.com/embed/${videoId}';
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.position = 'absolute'; // Add this line to position the iframe
          iframe.style.top = '0'; // Add this line to position the iframe
          iframe.style.left = '0'; // Add this line to position the iframe
          iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
          iframe.allowFullscreen = true;
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('autoplay', '1');
          document.body.style.margin = '0';
          document.body.style.overflow = 'hidden';
          document.body.appendChild(iframe);
        `);
      });
    }

    windows.push(win);
  }
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  windows.forEach((win) => win.close());
  windows.length = 0;
});
