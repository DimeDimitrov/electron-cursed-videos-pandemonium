import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  toWindow(html: string) {
    ipcRenderer.invoke("to-window", html);
  },
  initializeYouTubeEmbed() {
    // Notify the main process to initialize the YouTube embed
    ipcRenderer.send("initialize-youtube-embed");
  },
});

// Listen for initialization confirmation from the main process
ipcRenderer.on("youtube-embed-initialized", () => {
  // Notify the main process that the YouTube embed has been initialized in the renderer process
  ipcRenderer.send("youtube-embed-initialized");
});
