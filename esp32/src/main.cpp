// =================== FINAL LED CONTROL ESP32 CODE (HTTPS FIX) ===================
#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h> // HTTPS ke liye yeh zaroori hai
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ============== YAHAN APNI DETAILS DAALO ===================
// NOTE: Yeh details aap pehle hi daal chuke ho, bas check kar lena
const char* ssid = "Robozz Lab";
const char* password = "Robotics@cloud";

// Yeh aapke naye server ka bilkul sahi URL hai
String serverUrl = "https://led-control-project.onrender.com/get-status";

// LED jis pin se judi hai. ESP32 par D2 (GPIO 2) hota hai.
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
    
    // HTTPS Connection ke liye setup
    WiFiClientSecure client;
    client.setInsecure(); // WARNING: Hum certificate check nahi kar rahe hain (testing ke liye aasan)
    HTTPClient http;
    
    Serial.println("Server se status poochh raha hoon...");
    Serial.println("Connecting to URL: " + serverUrl);

    // Client aur URL, dono ke saath connection shuru karo
    if (http.begin(client, serverUrl)) {

      int httpResponseCode = http.GET();

      if (httpResponseCode == 200) { // Agar server ne "OK" bola
        String payload = http.getString();
        Serial.println("Jawaab mila: " + payload);

        // JSON jawaab ko samjho
        StaticJsonDocument<200> doc;
        deserializeJson(doc, payload);
        const char* status = doc["status"]; // "ON" ya "OFF" nikalo

        // LED ko control karo
        if (strcmp(status, "ON") == 0) {
          Serial.println("LED ko ON kar raha hoon");
          digitalWrite(ledPin, HIGH); // LED ON
        } else {
          Serial.println("LED ko OFF kar raha hoon");
          digitalWrite(ledPin, LOW); // LED OFF
        }

      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    } else {
      Serial.println("URL se connection nahi ban pa raha hai.");
    }

  } else {
    Serial.println("WiFi Disconnected");
  }

  // 5 second ke liye ruko
  delay(5000); 
}