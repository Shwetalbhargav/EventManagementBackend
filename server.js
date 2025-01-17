const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors()); 
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Real-time updates
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('newEvent', (event) => {
        socket.broadcast.emit('eventAdded', event);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Database and Server
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

mongoose
    .connect(DB_URI)
    .then(() => {
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.log(error));
