const { app, BrowserWindow, ipcMain, Menu, Tray } = require("electron");
const path = require("path");
const fs = require("fs");
const configPath = "./config.json";

// Remove top bar with 'Files' 'Edit' etc.
Menu.setApplicationMenu(null);

// Get data from config
let config = {};

try {
  const configData = fs.readFileSync(configPath);
  config = JSON.parse(configData);
} catch (error) {
  console.error(`Error reading configuration file: ${error}`);
}

// Default parameters for config if no config found
const videos = config.videos || [];
const volume = config.volume || 0.5;
const quality = config.quality || "small";

// Check if url is from youtube
function isYouTubeUrl(url) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}
// Convert YouTube url to and embed (Any other sources must be an embed)
function convertToEmbedUrl(url) {
  if (!isYouTubeUrl(url)) {
    return url; // Return the original URL if it's not from YouTube
  }
  const videoId = url.split("v=")[1];
  return `https://www.youtube.com/embed/${videoId}`;
}

let currentIndex = 0; // Track the current index of the video to be played

function getRandomVideo() {
  if (videos.length === 0) {
    return null; // No more videos available
  }

  const video = videos[currentIndex];
  currentIndex = (currentIndex + 1) % videos.length; // Increment the index, wrapping around to the beginning if necessary
  return convertToEmbedUrl(video);
}

// Opening a new window
let mainWindow;
let tray;

// Remove the top frame of the window

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

  // Create tray icon
  tray = new Tray(path.join(__dirname, "./icon.ico"));

  // Create context menu for the tray icon
  const trayMenu = Menu.buildFromTemplate([
    {
      label: "Minimize",
      click: () => {
        mainWindow.minimize(); // Minimize the main window
      },
    },
    {
      label: "Quit",
      click: () => {
        app.quit(); // Quit the application
      },
    },
  ]);

  // Set the context menu for the tray icon
  tray.setContextMenu(trayMenu);

  // Show/hide the main window when clicking the tray icon
  tray.on("click", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

// Handle the "minimize-to-tray" event from the renderer process
ipcMain.on("minimize-to-tray", () => {
  mainWindow.hide();
});

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

// Declare an array to store references to child windows
let childWindows = [];

// Create child windows based on count from index.html
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

      // Embed the iframe into the child window
      childWindow.webContents.executeJavaScript(`
      
        const iframe = document.createElement('iframe');
        iframe.src = '${video}?vq=${quality}';
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.frameborder = 0;
        iframe.volume = ${volume}
        document.body.appendChild(iframe);
      `);
    });
    childWindow.on("closed", () => {
      childWindows = childWindows.filter((win) => win !== childWindow);
      childWindow = null;
    });
    childWindows.push(childWindow);
  }
  // Close all child windows when the main window is closed
  mainWindow.on("closed", () => {
    for (let i = 0; i < childWindows.length; i++) {
      childWindows[i].close();
    }
  });
});
