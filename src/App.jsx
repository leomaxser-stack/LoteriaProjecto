import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { cards as allCards } from './data/cards'
import StartScreen from './components/StartScreen'
import LobbyScreen from './components/LobbyScreen'
import GameScreen from './components/GameScreen'
import WinScreen from './components/WinScreen'
import './index.css'

function App() {
  const [gameState, setGameState] = useState('start') // start, lobby, playing, won
  const [playerName, setPlayerName] = useState('')
  const [roomId, setRoomId] = useState('')
  const [winner, setWinner] = useState(null)
  const [socket, setSocket] = useState(null)
  const [board, setBoard] = useState([])
  const [players, setPlayers] = useState([])
  const [isHost, setIsHost] = useState(false)

  // Initialize Socket
  useEffect(() => {
    // Use environment variable for production, fallback to localhost for dev
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
    console.log("Connecting to server at:", serverUrl);
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.on('playerJoined', ({ name, id }) => {
      setPlayers(prev => [...prev, { name, id: id || Date.now() }]);
    });

    newSocket.on('gameStarted', () => {
      setGameState('playing');
    });

    return () => newSocket.disconnect();
  }, []);

  const hydrateBoard = (serverBoard) => {
    if (!serverBoard || !Array.isArray(serverBoard)) return [];
    return serverBoard.map(serverCard => {
      // Find local card definition by ID
      const localCard = allCards.find(c => c.id == serverCard.id);
      // Merge/Override
      return { ...serverCard, ...localCard };
    });
  };

  const handleCreateRoom = (name) => {
    setPlayerName(name);
    socket.emit('createRoom', { playerName: name }, (response) => {
      if (response.success) {
        setRoomId(response.roomId);
        setBoard(hydrateBoard(response.board));
        setPlayers([{ name, isHost: true, id: socket.id }]);
        setIsHost(true);
        setGameState('lobby');
      } else {
        alert('Error creating room: ' + response.error);
      }
    });
  }

  const handleJoinRoom = (name, roomCode) => {
    setPlayerName(name);
    socket.emit('joinRoom', { roomId: roomCode, playerName: name }, (response) => {
      if (response.success) {
        setRoomId(response.roomId);
        setBoard(hydrateBoard(response.board));
        setPlayers(response.players);
        setIsHost(response.isHost);
        setGameState('lobby');
      } else {
        alert('Error joining room: ' + response.error);
      }
    });
  }

  const handleStartGame = (difficulty) => {
    socket.emit('startGame', { roomId, difficulty });
  }

  const handleWin = (name) => {
    setWinner(name)
    setGameState('won')
  }

  const handleRestart = () => {
    setGameState('start')
    setWinner(null)
    setPlayerName('')
    setBoard([])
    setPlayers([])
    window.location.reload();
  }

  return (
    <>
      {gameState === 'start' &&
        <StartScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      }

      {gameState === 'lobby' &&
        <LobbyScreen
          roomId={roomId}
          playerName={playerName}
          players={players}
          isHost={isHost}
          onStart={handleStartGame}
        />
      }

      {gameState === 'playing' &&
        <GameScreen
          playerName={playerName}
          boardCards={board}
          socket={socket}
          roomId={roomId}
          onWin={handleWin}
          onRestart={handleRestart}
        />
      }

      {gameState === 'won' && <WinScreen winner={winner} onRestart={handleRestart} />}
    </>
  )
}

export default App
