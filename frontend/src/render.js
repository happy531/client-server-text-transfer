const { ipcRenderer } = require("electron");

const ipInput = document.getElementById("ip");
const portInput = document.getElementById("port");
const messInput = document.getElementById("mess");
ipInput.value = "192.168.0.34";
portInput.value = 3001;
messInput.value = "hello";

function handleConnect() {
  ipcRenderer.send("connect", {
    ip: ipInput.value.toString(),
    port: Number(portInput.value),
  });

  ipcRenderer.on("reply", (event, data) => {
    console.log(data);
  });
}
const connBtn = document.getElementById("conn-btn");
connBtn.onclick = handleConnect;

function sendMessage() {
  ipcRenderer.send("message", {
    message: messInput.value.toString(),
  });
}
const sendMessBtn = document.getElementById("send-mess");
sendMessBtn.onclick = sendMessage;

function handleDisconnect() {
  ipcRenderer.send("disconnect");
}
const disconnectBtn = document.getElementById("disconn-btn");
disconnectBtn.onclick = handleDisconnect;
