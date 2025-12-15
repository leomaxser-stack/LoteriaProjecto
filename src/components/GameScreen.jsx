import React, { useState, useEffect } from 'react';
import Board from './Board';
import { cards as allCards } from '../data/cards';

const GameScreen = ({ playerName, boardCards, socket, roomId, onWin, onRestart }) => {
    const [markedCards, setMarkedCards] = useState(new Set());
    const [currentCard, setCurrentCard] = useState(null);
    const [history, setHistory] = useState([]);
    const [selectedInfoCard, setSelectedInfoCard] = useState(null);

    // Listen for game events
    useEffect(() => {
        if (!socket) return;

        const handleCardDrawn = (serverCard) => {
            console.log("Card Received:", serverCard);
            // Hydrate the card with local data
            const fullCard = allCards.find(c => c.id == serverCard.id) || serverCard;

            setCurrentCard(fullCard);
            setHistory(prev => [...prev, fullCard]);
            speakCard(fullCard);
        };

        const handleGameWon = ({ winnerName }) => {
            onWin(winnerName);
        };

        const handleGameOver = ({ winner }) => {
            onWin(winner); // winner will be null
        };

        socket.on('cardDrawn', handleCardDrawn);
        socket.on('gameWon', handleGameWon);
        socket.on('gameOver', handleGameOver);

        return () => {
            socket.off('cardDrawn', handleCardDrawn);
            socket.off('gameWon', handleGameWon);
            socket.off('gameOver', handleGameOver);
        };
    }, [socket, onWin]);

    const speakCard = (card) => {
        if (!card) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(card.name);
        utterance.lang = 'es-MX';
        window.speechSynthesis.speak(utterance);
    };

    const handleToggleMark = (id) => {
        const hasAppeared = history.some(c => c.id === id);

        if (!hasAppeared) {
            alert("¡Esa carta no ha salido todavía!");
            return;
        }

        setMarkedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleCallLoteria = () => {
        const isWin = boardCards.every(c => markedCards.has(c.id));
        if (isWin) {
            socket.emit('checkLoteria', { roomId });
        }
    };

    useEffect(() => {
        const isWin = boardCards.length > 0 && boardCards.every(c => markedCards.has(c.id));
        if (isWin) {
            socket.emit('checkLoteria', { roomId });
        }
    }, [markedCards, boardCards, socket, roomId]);

    return (
        <div className="game-screen">
            <div className="game-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div className="player-info" style={{
                    fontSize: '3rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFD700 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Jugador: {playerName}
                </div>
                <div className="controls">
                    <button onClick={onRestart} style={{ backgroundColor: 'var(--color-text)' }}>
                        Salir
                    </button>
                </div>
            </div>

            <div className="game-layout" style={{ display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>

                {/* Left Column: Current Card */}
                <div className="current-card-section" style={{ flex: '0 0 300px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ color: '#FFD700', fontFamily: 'var(--font-heading)' }}>Carta Actual</h3>
                    {currentCard ? (
                        <>
                            <div className="current-card-display">
                                <img src={currentCard.image} alt={currentCard.name} style={{ width: '100%', borderRadius: '4px' }} />
                                <h2 style={{ color: 'var(--color-secondary)' }}>{currentCard.name}</h2>
                                <p style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{currentCard.state}</p>
                            </div>

                            {/* Info Box - Explicitly placed here */}
                            <div className="card-info-box" style={{
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                padding: '15px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                border: '3px solid var(--color-tertiary)',
                                textAlign: 'left',
                                width: '100%',
                                maxWidth: '280px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}>
                                <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-primary)', fontSize: '1.2rem' }}>Información</h4>
                                <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.4', color: '#333' }}>
                                    {currentCard.description || "Esperando descripción..."}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="waiting" style={{ padding: '50px', border: '2px dashed #ccc', borderRadius: '10px' }}>
                            Esperando carta...
                        </div>
                    )}

                    <div className="history" style={{ marginTop: '10px', textAlign: 'left', width: '100%' }}>
                        <h4 style={{ color: '#00D4AA' }}>Historial ({history.length} / {allCards.length})</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {history.slice().reverse().slice(0, 8).map(c => (
                                <span key={c.id} style={{ fontSize: '0.9rem', padding: '5px 10px', background: 'white', border: '1px solid #ccc', borderRadius: '15px' }}>
                                    {c.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Board */}
                <div className="board-section">
                    <Board
                        cards={boardCards}
                        markedCards={markedCards}
                        onToggleMark={handleToggleMark}
                        onShowInfo={setSelectedInfoCard}
                    />
                </div>
            </div>

            {/* Info Modal */}
            {selectedInfoCard && (
                <div className="overlay" onClick={() => setSelectedInfoCard(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ color: 'var(--color-secondary)', fontSize: '2rem', marginBottom: '10px' }}>{selectedInfoCard.name}</h2>
                        {selectedInfoCard.state && <p style={{ fontStyle: 'italic', color: '#666', fontSize: '1.1rem', fontWeight: '600' }}>{selectedInfoCard.state}</p>}

                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />

                        {selectedInfoCard.image ? (
                            <img
                                src={selectedInfoCard.image}
                                alt={selectedInfoCard.name}
                                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '12px', marginBottom: '15px', display: 'block', margin: '0 auto 15px' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div style={{ height: '200px', background: '#eee', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                                <span style={{ color: '#999' }}>Sin imagen</span>
                            </div>
                        )}

                        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#2c3e50', textAlign: 'justify' }}>
                            {selectedInfoCard.description || "Sin descripción disponible."}
                        </p>

                        <button onClick={() => setSelectedInfoCard(null)} style={{ marginTop: '20px' }}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameScreen;
