// =================================================================
// 1. Zaroori Libraries ko bulana (Importing Libraries)
// =================================================================
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// =================================================================
// 2. Server ki taiyari karna (Server Setup)
// =================================================================
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let esp32Socket = null; 

// =================================================================
// 3. WebSocket Connection ka Logic (The Hotline)
// =================================================================
wss.on('connection', (ws) => {
  console.log('Client connected!');

  esp32Socket = ws;

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected!');
    esp32Socket = null;
  });

  ws.on('error', (error) => {
    console.error('WebSocket Error:', error);
    esp32Socket = null;
  });

  ws.on('ping', () => {
    console.log("Ping received from client. Sending Pong.");
    ws.pong();
  });
});

// =================================================================
// 4. Flutter App se aane wali Request ka Logic (The Control Panel)
// =================================================================

// Jab Flutter App se "/led-on" ki request aaye
app.get('/led-on', (req, res) => {
  console.log("Flutter se '/led-on' request aayi");
  if (esp32Socket) {
    esp32Socket.send('ON');
    res.send('LED ON command sent to ESP32!');
    console.log("ESP32 ko 'ON' command bheja gaya.");
  } else {
    res.status(500).send('ESP32 is not connected!');
    console.log("Error: ESP32 connected nahi hai.");
  }
});

// Jab Flutter App se "/led-off" ki request aaye
app.get('/led-off', (req, res) => {
  console.log("Flutter se '/led-off' request aayi");
  if (esp32Socket) {
    esp32Socket.send('OFF');
    res.send('LED OFF command sent to ESP32!');
    console.log("ESP32 ko 'OFF' command bheja gaya.");
  } else {
    res.status(500).send('ESP32 is not connected!');
    console.log("Error: ESP32 connected nahi hai.");
  }
});

// <<< YEH HAI NAYA CODE JO UPTIMEROBOT KE LIYE HAI >>>
// UptimeRobot jaise services ke liye, main route ('/') par jawaab dena
app.get('/', (req, res) => {
  res.send('Hello! The LED server is alive and well!');
});
// <<< YAHAN TAK HAI NAYA CODE >>>


// =================================================================
// 5. Server ko Chalu Karna (Start the Server)
// =================================================================
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log('ESP32 ke connect hone ka intezaar hai...');
});