import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
let cardCount = 0;

console.log("Connecting to server...");

socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);

    // Create room
    socket.emit("createRoom", { playerName: "Tester" }, (response) => {
        if (response.success) {
            console.log("Room created:", response.roomId);
            console.log("Starting game...");
            socket.emit("startGame", { roomId: response.roomId });
        } else {
            console.error("Failed to create room:", response.error);
            process.exit(1);
        }
    });
});

socket.on("gameStarted", (data) => {
    console.log("Game started! Expecting deck size:", data.deckSize);
});

socket.on("cardDrawn", (card) => {
    cardCount++;
    console.log(`Card ${cardCount}: ${card.name} (ID: ${card.id})`);
});

socket.on("gameOver", (data) => {
    console.log("\n--- GAME OVER ---");
    console.log(`Total cards received: ${cardCount}`);

    if (cardCount === 20) {
        console.log("SUCCESS: All 20 cards were drawn.");
    } else {
        console.error(`FAILURE: Received ${cardCount} cards, expected 20.`);
    }
    socket.disconnect();
    process.exit(0);
});

// Timeout fail-safe
setTimeout(() => {
    console.log("\nTest timed out (90s).");
    console.log(`Total cards received: ${cardCount}`);
    socket.disconnect();
    process.exit(1);
}, 90000);
