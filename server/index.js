// =================================================================
// 1. Zaroori Libraries ko bulana (Importing Libraries)
// =================================================================
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// =================================================================
// 2. Server ki taiyari karna (Server Setup)
// =================================================================
const port = process.env.PORT || 3000; // Render apne aap port dega, local ke liye 3000
const app = express(); // Express app banana
const server = http.createServer(app); // Express app se HTTP server banana
const wss = new WebSocket.Server({ server }); // Isi HTTP server se WebSocket server banana

// Yeh variable hamare ESP32 ka connection store karega
let esp32Socket = null; 

// =================================================================
// 3. WebSocket Connection ka Logic (The Hotline)
// =================================================================
wss.on('connection', (ws) => {
  console.log('Client connected!'); // Jab bhi koi (ESP32) connect hoga, yeh message dikhega

  // ESP32 connect ho gaya hai, usko esp32Socket variable me save karlo
  esp32Socket = ws;

  // Jab client se koi message aaye (future use ke liye)
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
  });

  // Jab client disconnect ho
  ws.on('close', () => {
    console.log('Client disconnected!');
    esp32Socket = null; // Connection toot gaya, to variable khaali kardo
  });

  // Connection par error aaye to
  ws.on('error', (error) => {
    console.error('WebSocket Error:', error);
    esp32Socket = null;
  });

  // Heartbeat ko zinda rakhne ke liye PING-PONG
  ws.on('ping', () => {
    console.log("Ping received from client. Sending Pong.");
    ws.pong(); // Jaise hi ping aaye, pong bhejo
  });
});

// =================================================================
// 4. Flutter App se aane wali Request ka Logic (The Control Panel)
// =================================================================

// Jab Flutter App se "/led-on" ki request aaye
app.get('/led-on', (req, res) => {
  console.log("Flutter se '/led-on' request aayi");
  if (esp32Socket) {
    esp32Socket.send('ON'); // ESP32 ko 'ON' message bhejo
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
    esp32Socket.send('OFF'); // ESP32 ko 'OFF' message bhejo
    res.send('LED OFF command sent to ESP32!');
    console.log("ESP32 ko 'OFF' command bheja gaya.");
  } else {
    res.status(500).send('ESP32 is not connected!');
    console.log("Error: ESP32 connected nahi hai.");
  }
});

// =================================================================
// 5. Server ko Chalu Karna (Start the Server)
// =================================================================
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log('ESP32 ke connect hone ka intezaar hai...');
});