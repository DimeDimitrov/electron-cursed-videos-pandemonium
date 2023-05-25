window.addEventListener("DOMContentLoaded", () => {
  const { ipcRenderer } = window.electron;

  ipcRenderer.on("window-index", (event, index) => {
    document.getElementById("index").textContent = index;
  });
});
