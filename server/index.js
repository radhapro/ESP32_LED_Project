 // =================== REAL-TIME SERVER CODE (with Socket.IO) ===================
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io"); // Nayi "ghanti" waali library
require('dotenv').config();

const app = express();
const server = http.createServer(app); // Express server ko thoda badla
const io = new Server(server, { cors: { origin: "*" } }); // Ghanti (Socket.IO) ko server se joda

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.enable('trust proxy');

// MongoDB se connection (waisa hi hai)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB se jud gaye!'))
    .catch(err => console.log('MongoDB se judne me error:', err));

const ledSchema = new mongoose.Schema({
    controlId: { type: String, default: "main_led" },
    status: { type: String, required: true, enum: ['ON', 'OFF'] }
});

const LedStatus = mongoose.model('LedStatus', ledSchema);

// Check karne ke liye ek simple raasta
app.get("/", (req, res) => {
    res.send("Hello! Real-time Server is running!");
});

// 1. App se command LENE ka raasta (POST) - Yeh lagbhag waisa hi hai
app.post('/set-status', async (req, res) => {
    const { status } = req.body;
    if (status !== 'ON' && status !== 'OFF') {
        return res.status(400).send('Galat status bheja hai.');
    }
    try {
        await LedStatus.findOneAndUpdate(
            { controlId: "main_led" },
            { status: status },
            { upsert: true, new: true }
        );
        console.log(`LED ka status update ho gaya: ${status}`);
        
        // ================== YEH HAI ASLI JAADU ==================
        // Jaise hi status update ho, sabke liye ghanti baja do
        io.emit('led_status_update', status); // Humne 'led_status_update' naam ki ghanti bajayi
        console.log(`Ghanti bajayi: LED ka naya status hai ${status}`);
        // =========================================================

        res.status(200).send(`Status ko ${status} set kar diya hai`);
    } catch (error) {
        console.log('Status update karne me error:', error);
        res.status(500).send('Server me error aa gaya');
    }
});

// 2. ESP32 ko command DENE ka raasta (GET) - Yeh abhi bhi rakhenge (Backup ke liye)
app.get('/get-status', async (req, res) => {
    try {
        const currentStatus = await LedStatus.findOne({ controlId: "main_led" });
        if (currentStatus) {
            res.status(200).json({ status: currentStatus.status });
        } else {
            await new LedStatus({ controlId: "main_led", status: "OFF" }).save();
            res.status(200).json({ status: "OFF" });
        }
    } catch (error) {
        console.log('Status lene me error:', error);
        res.status(500).send('Server me error aa gaya');
    }
});

// 3. Jab koi (ESP32) ghanti sunne ke liye connect hoga to kya hoga
io.on('connection', (socket) => {
    console.log('Ek naya client (shayad ESP32) connect hua hai!');
    
    // Jaise hi koi naya client connect ho, usko turant current status bhej do
    LedStatus.findOne({ controlId: "main_led" })
        .then(currentStatus => {
            if (currentStatus) {
                socket.emit('led_status_update', currentStatus.status);
            } else {
                socket.emit('led_status_update', 'OFF'); // Shuruaat me OFF bhejo
            }
        });

    socket.on('disconnect', () => {
        console.log('Client disconnect ho gaya.');
    });
});

// Naye server ko chalu karo
server.listen(PORT, () => {
    console.log(`Real-time Server port ${PORT} par chalu ho gaya hai...`);
});