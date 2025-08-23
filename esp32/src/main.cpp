// =================== LED CONTROL ESP32 CODE ===================
#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ============== YAHAN APNI DETAILS DAALO ===================
const char* ssid = "Robozz Lab";
const char* password = "Robotics@cloud";
// SERVER URL ABHI KHAALI CHHOD DO, HUM BAAD ME BHARENGE
String serverUrl = "https://led-control-project.onrender.com/get-status";
const int ledPin = 2;
// ==========================================================

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  delay(1000);
  Serial.print("WiFi se jud raha hai...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi jud gaya!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    Serial.println("Server se status poochh raha hoon...");
    http.begin(serverUrl);
    int httpResponseCode = http.GET();
    if (httpResponseCode == 200) {
      String payload = http.getString();
      Serial.println("Jawaab mila: " + payload);
      StaticJsonDocument<200> doc;
      deserializeJson(doc, payload);
      const char* status = doc["status"];
      if (strcmp(status, "ON") == 0) {
        Serial.println("LED ko ON kar raha hoon");
        digitalWrite(ledPin, HIGH);
      } else {
        Serial.println("LED ko OFF kar raha hoon");
        digitalWrite(ledPin, LOW);
      }
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
  delay(5000);
}