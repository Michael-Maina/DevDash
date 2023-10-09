import { TerminalUI } from "./TerminalUI";
import io from "socket.io-client";

function getCookie(cookieName) {
  let name = cookieName + "=";
  let ca = document.cookie.split(';');

  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function connectToSocket(serverAddress) {
  return new Promise(res => {
    const socket = io(serverAddress);
    res(socket);
  });
}

function startTerminal(container, socket) {
  // Create an xterm.js instance
  const terminal = new TerminalUI(socket);

  // Attach created terminal to a DOM element.
  terminal.attachTo(container);

  // When terminal attached to DOM, start listening for input, output events.
  terminal.startListening();
}

function start() {
  const container = document.getElementById("terminal-container");
  const port = getCookie('port').toString();
  const serverAddress = ['http://localhost:', port].join('');

  // Connect to socket and when it is available, start terminal.
  connectToSocket(serverAddress).then(socket => {
    startTerminal(container, socket);
  });
}

start();
