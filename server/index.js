 // =================== FINAL SERVER CODE (HTTP FIX) ===================
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Yeh line zaroori hai Render ke proxy ke liye
app.enable('trust proxy');

// Check karne ke liye ek simple raasta
app.get("/", (req, res) => {
    res.send("Hello! Server is running!");
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB se jud gaye!'))
    .catch(err => console.log('MongoDB se judne me error:', err));

const ledSchema = new mongoose.Schema({
    controlId: { type: String, default: "main_led" }, 
    status: { type: String, required: true, enum: ['ON', 'OFF'] }
});

const LedStatus = mongoose.model('LedStatus', ledSchema);

app.post('/set-status', async (req, res) => {
    const { status } = req.body;
    if (status !== 'ON' && status !== 'OFF') {
        return res.status(400).send('Galat status bheja hai. Sirf "ON" ya "OFF" bhejo.');
    }
    try {
        await LedStatus.findOneAndUpdate(
            { controlId: "main_led" },
            { status: status },
            { upsert: true, new: true }
        );
        console.log(`LED ka status update ho gaya: ${status}`);
        res.status(200).send(`Status ko ${status} set kar diya hai`);
    } catch (error) {
        console.log('Status update karne me error:', error);
        res.status(500).send('Server me error aa gaya');
    }
});

app.get('/get-status', async (req, res) => {
    try {
        const currentStatus = await LedStatus.findOne({ controlId: "main_led" });
        if (currentStatus) {
            res.status(200).json({ status: currentStatus.status });
        } else {
            // Agar pehli baar hai, to ek OFF status bana do
            await new LedStatus({ controlId: "main_led", status: "OFF" }).save();
            res.status(200).json({ status: "OFF" });
        }
    } catch (error) {
        console.log('Status lene me error:', error);
        res.status(500).send('Server me error aa gaya');
    }
});

app.listen(PORT, () => {
    console.log(`LED Control Server port ${PORT} par chalu ho gaya hai...`);
});