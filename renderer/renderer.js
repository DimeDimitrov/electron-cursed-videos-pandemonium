function openWindows() {
  const windowCount = document.getElementById("windowCount").value;
  electron.ipcRenderer.send("open-windows", windowCount);
}

function minimize() {
  electron.ipcRenderer.send("minimize-to-tray");
}
