
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { gameManager } from './gameManager.js';

const app = express();
app.use(cors());

// Default route for browser check
app.get('/', (req, res) => {
    res.send('<h1>El servidor esta corriendo! </h1><p>Accede al cliente por el puerto 5173.</p>');
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all origins for dev
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('createRoom', ({ playerName }, callback) => {
        try {
            const roomId = gameManager.createRoom(socket.id);
            const player = gameManager.joinRoom(roomId, socket.id, playerName);
            socket.join(roomId);
            callback({
                success: true,
                roomId,
                board: player.board,
                isHost: true
            });
            console.log(`Room ${roomId} created by ${playerName}`);
        } catch (e) {
            callback({ success: false, error: e.message });
        }
    });

    socket.on('joinRoom', ({ roomId, playerName }, callback) => {
        try {
            const player = gameManager.joinRoom(roomId, socket.id, playerName);
            socket.join(roomId);

            // Notify others in room
            socket.to(roomId).emit('playerJoined', { name: playerName, id: socket.id });

            // Get current room state (players list)
            const room = gameManager.getRoom(roomId);
            const playersList = Array.from(room.players.values()).map(p => ({
                name: p.name,
                id: p.id
            }));

            callback({
                success: true,
                roomId,
                board: player.board,
                players: playersList,
                isHost: room.hostId === socket.id
            });
            console.log(`${playerName} joined room ${roomId}`);
        } catch (e) {
            callback({ success: false, error: e.message });
        }
    });

    socket.on('startGame', ({ roomId, difficulty }) => {
        const room = gameManager.getRoom(roomId);
        if (room && room.hostId === socket.id) {
            room.startGame(io, difficulty);
        }
    });

    socket.on('checkLoteria', ({ roomId }) => {
        const room = gameManager.getRoom(roomId);
        if (room) {
            const didWin = room.validateWin(socket.id);
            if (didWin) {
                room.stopGame();
                const possibleWinner = room.players.get(socket.id);
                io.to(roomId).emit('gameWon', { winnerName: possibleWinner.name });
            } else {
                // Optional: penalize false call
            }
        }
    });

    socket.on('disconnect', () => {
        // Handle cleanup (remove player from rooms)
        // Simplified for now
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
