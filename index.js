const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const configPath = "./config.json";

let config = {};

try {
  const configData = fs.readFileSync(configPath);
  config = JSON.parse(configData);
} catch (error) {
  console.error(`Error reading configuration file: ${error}`);
}

const videoIds = config.videoIds || [];
const volume = config.volume || 0.5;
const quality = config.quality || "small";

function getRandomVideo() {
  const randomIndex = Math.floor(Math.random() * videos.length);
  return videos[randomIndex];
}

let mainWindow;

Menu.setApplicationMenu(null);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "./renderer/preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "./src/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("open-windows", (event, count) => {
  for (let i = 0; i < count; i++) {
    let childWindow = new BrowserWindow({
      width: 400,
      height: 300,
      icon: path.join(__dirname, "icon.ico"),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "./renderer/preload.js"),
      },
      titleBarStyle: "hiddenInset",
    });

    childWindow.loadFile(path.join(__dirname, "./src/child.html"));

    childWindow.webContents.on("did-finish-load", () => {
      const video = getRandomVideo();
      childWindow.webContents.executeJavaScript(`
      
        const iframe = document.createElement('iframe');
        iframe.src = '${video}?vq=${quality}';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.frameborder = 0;
        iframe.volume = ${volume}
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';
        document.body.appendChild(iframe);
      `);
    });

    childWindow.on("closed", () => {
      childWindow = null;
    });
  }
});
