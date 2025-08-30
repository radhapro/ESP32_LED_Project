 # Project: ESP32 LED Controller - ## Version 3.0: 24/7 Reliability Fix
---

## Version 3.0: 24/7 Reliability Fix

### Problem:
Render ke free plan par server, agar 15 minute tak use na kiya jaye, to 'so jaata hai' (idle ho jaata hai). Iski vajah se ESP32 ka WebSocket connection toot jaata tha aur app thodi der baad kaam karna band kar deta tha.

### Solution:
Is problem ko solve karne ke liye, humne ek free online service **UptimeRobot** ka istemal kiya hai. UptimeRobot har 5 minute me hamare Render server ke URL ko internet se 'ping' karta hai.

### Nateeja (Result):
Is lagaatar 'ping' ki vajah se, Render server hamesha 'jaagta' rehta hai aur kabhi idle nahi hota. Isse ESP32 ka connection hamesha bana rehta hai aur app 24/7, bina kisi rukawat ke kaam karta hai.

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


