const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const api = require("./routes");
const AUDIO_DIR = path.join(__dirname, "files");
const HTTP_PORT = 3005;

require("electron-reload")(__dirname);

app.whenReady().then(() => {
  if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR);
  // Removed createWindow(); to prevent showing the Electron window
  api.listen(HTTP_PORT, () => {
    console.log(
      `Electron Bridge API listening on http://localhost:${HTTP_PORT}`
    );
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
