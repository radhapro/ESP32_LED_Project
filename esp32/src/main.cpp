 // =================== REAL-TIME ESP32 CODE (with WebSockets) ===================
#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsClient.h> // Ghanti sunne waali library
#include <ArduinoJson.h>

// ============== YAHAN APNI DETAILS DAALO ===================
const char* ssid = "Lab_12345";
const char* password = "Lamda12345";

// YEH AAPKE NAYE SERVER KA HOSTNAME HAI (https:// ke bina)
const char* server_host = "led-control-project.onrender.com"; 
// SERVER KA PORT (HTTPS ke liye 443 hota hai)
const int server_port = 443;

const int ledPin = 2;
// ==========================================================

WebSocketsClient webSocket; // Humara "kaan" jo ghanti sunega

// Yeh function tab chalta hai jab ghanti bajti hai (server se message aata hai)
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.println("WebSocket disconnect ho gaya!");
            break;
        case WStype_CONNECTED:
            Serial.println("WebSocket jud gaya!");
            // Server ko batao ki hum taiyaar hain
            // Socket.IO protocol ke hisaab se pehle '2' bhejna hota hai
            webSocket.sendTXT("2");
            break;
        case WStype_TEXT:
            Serial.printf("Server se message mila: %s\n", payload);
            
            // Aaye hue message ko samjho
            // Message kuch aisa dikhega: 42["led_status_update","ON"]
            if (payload[0] == '4' && payload[1] == '2') {
                StaticJsonDocument<200> doc;
                deserializeJson(doc, &payload[2]); // Shuru ke '42' ko chhod do
                
                const char* eventName = doc[0];
                const char* status = doc[1];

                if (strcmp(eventName, "led_status_update") == 0) {
                    if (strcmp(status, "ON") == 0) {
                        Serial.println("COMMAND: LED ko ON kar raha hoon");
                        digitalWrite(ledPin, HIGH);
                    } else {
                        Serial.println("COMMAND: LED ko OFF kar raha hoon");
                        digitalWrite(ledPin, LOW);
                    }
                }
            }
            break;
    }
}

void setup() {
    Serial.begin(115200);
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, LOW);
    delay(1000);

    // WiFi se connect karo (waisa hi hai)
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi jud gaya!");

    // Ab server se WebSocket (ghanti sunne waala) connection banao
    // URL me /socket.io/?EIO=4&transport=websocket likhna zaroori hai
    webSocket.beginSSL(server_host, server_port, "/socket.io/?EIO=4&transport=websocket", "", "https");
    webSocket.onEvent(webSocketEvent); // Server se koi bhi message aane par kya karna hai
    webSocket.setReconnectInterval(5000); // Agar connection toote to har 5 sec me try karo
}

void loop() {
    // loop() ka kaam ab sirf connection zinda rakhna hai
    webSocket.loop();
}