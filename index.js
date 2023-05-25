const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");

const videoIds = [
  "ybS7AHGoEI8",
  "2VXacYLcjGA",
  "rvcaEzUtcWk",
  "_nQU_8Nm0Yk",
  "T8r3cWM4JII",
  "V7HdWeYbV3Q",
];

function getRandomVideoId() {
  const randomIndex = Math.floor(Math.random() * videoIds.length);
  return videoIds[randomIndex];
}

let mainWindow;

Menu.setApplicationMenu(null);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

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
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    childWindow.loadFile(path.join(__dirname, "child.html"));

    childWindow.webContents.on("did-finish-load", () => {
      const videoId = getRandomVideoId();
      childWindow.webContents.executeJavaScript(`
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/${videoId}';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
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

    childWindow.on("closed", () => {
      childWindow = null;
    });
  }
});
