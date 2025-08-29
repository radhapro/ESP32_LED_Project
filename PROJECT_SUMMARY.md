# Project: ESP32 LED Controller - v1.0

Ye is project ka pehla safal version hai.

---

## Zaroori Links aur Jaankari

### 1. Live Server (Render)

*   **URL:** https://radhapro-led-server.onrender.com

### 2. Code Repository (GitHub)

*   **URL:** https://github.com/radhapro/ESP32_LED_Project

### 3. Technology Stack

*   **Mobile App:** Flutter
*   **Server:** Node.js + Express.js (Render par hosted)
*   **Real-time Communication:** WebSockets
*   **Hardware:** ESP32

---

## Version 1.0 Functionality

*   Mobile app me 2 button (ON/OFF) hain.
*   Button dabane par app Render server ko HTTP request bhejta hai.
*   Server, ESP32 ke saath bane hue WebSocket connection par turant 'ON' ya 'OFF' ka message bhejta hai.
*   ESP32 message milte hi apni in-built LED ko ON ya OFF karta hai.
*   Response time 1 second se bhi kam hai.