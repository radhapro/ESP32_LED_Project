 #include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsClient.h>

// =================================================================
// 1. APNI DETAILS YAHAAN DAALO (IMPORTANT)
// =================================================================
const char* ssid = "Robozz Lab";         // Apne WiFi ka naam yahan likho
const char* password = "Robotics@cloud"; // Apne WiFi ka password yahan likho

// Apne RENDER SERVER ka URL yahan likho (bina https:// ke)
const char* websocket_server_host = "radhapro-led-server.onrender.com"; 
const uint16_t websocket_server_port = 443; // Render ke liye 443 use karna hai (SSL/WSS)

// ESP32 ki in-built LED GPIO 2 par hoti hai
#define LED_PIN 2

// =================================================================
// 2. WebSocket Object Banana
// =================================================================
WebSocketsClient webSocket;
// Heartbeat (ping-pong) ke liye timer
unsigned long lastPingTime = 0;
const unsigned long pingInterval = 30000; // 30 seconds

// =================================================================
// 3. WebSocket ke Events ko Handle Karna
// =================================================================
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[WSc] Disconnected!\n");
      break;
    case WStype_CONNECTED:
      Serial.printf("[WSc] Connected to url: %s\n", payload);
      break;
    case WStype_TEXT:
      Serial.printf("[WSc] get text: %s\n", payload);
      
      // Server se 'ON' message aaya
      if (strcmp((char*)payload, "ON") == 0) {
        digitalWrite(LED_PIN, HIGH); // LED ko ON karo
        Serial.println("LED is ON");
      }
      // Server se 'OFF' message aaya
      else if (strcmp((char*)payload, "OFF") == 0) {
        digitalWrite(LED_PIN, LOW); // LED ko OFF karo
        Serial.println("LED is OFF");
      }
      break;
  }
}

// =================================================================
// 4. SETUP: Sirf ek baar chalta hai
// =================================================================
void setup() 
{
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); // Shuru me LED ko band rakho

  // WiFi se connect karna
  Serial.println();
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  webSocket.beginSSL(websocket_server_host, websocket_server_port, "/");
   
  // Events ke liye function set karna
  webSocket.onEvent(webSocketEvent);
  
  // Baar-baar connect karne ki koshish karna
  webSocket.setReconnectInterval(5000);
}

// =================================================================
// 5. LOOP: Baar-baar chalta rehta hai
// =================================================================
void loop() 
{
  webSocket.loop(); // WebSocket connection ko zinda rakho
  // Heartbeat (Ping) bhejne ka logic
  if (millis() - lastPingTime > pingInterval) {
    lastPingTime = millis(); // Timer ko reset karo
    if (webSocket.isConnected()) {
      webSocket.sendPing(); // Server ko PING bhejo
      Serial.println("-> Sent Ping to server");
    }
  }
}