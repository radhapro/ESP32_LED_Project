 # Project: ESP32 LED Controller - v2.0 (Stable Version)

Ye is project ka stable version hai jisme "connection timeout" ki problem ko theek kar diya gaya hai.

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

## Version 2.0 Functionality (Improvements)

*   **Heartbeat System:** Idle (khaali) connection ko zinda rakhne ke liye ek "Heartbeat" (Ping-Pong) system lagaya gaya hai.
    *   ESP32 har 30 second me server ko ek `ping` bhejta hai.
    *   Server us `ping` ka `pong` se jawaab deta hai.
*   **Stable Connection:** Is Heartbeat system ki vajah se, server aur ESP32 ke beech ka connection ab 5-10 minute baad bhi nahi tootta.
*   **Reliability:** System ab motor jaise zaroori kaamo ke liye bhi aitemaad ke laayak hai. App ko ghanton baad bhi istemal karne par LED control hoti hai.