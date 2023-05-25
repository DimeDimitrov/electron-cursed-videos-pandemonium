function openWindows() {
  const windowCount = document.getElementById("windowCount").value;
  electron.ipcRenderer.send("open-windows", windowCount);
}
