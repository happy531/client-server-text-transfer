const { app, BrowserWindow, ipcMain } = require("electron");
const net = require("net");
const path = require("path");
const fs = require("fs");

if (require("electron-squirrel-startup")) {
  app.quit();
}

ipcMain.on("connect", (event, data) => {
  console.warn(data);
  event.reply("reply", "thank you");

  const client = new net.Socket();
  client.connect(data.port, data.ip, function () {
    console.log("Connected");
  });

  ipcMain.on("message", (event, data) => {
    // console.log(data.message);
    client.write(data.message);
    // fs.readFile("file.txt", function (err, buf) {
    //   client.emit("file", { buffer: buf });
    // });

    // client.destroy();
  });

  ipcMain.on("disconnect", (event, data) => {
    client.write(true);
  });
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  // mainWindow.webContents.openDevTools();
};
app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
