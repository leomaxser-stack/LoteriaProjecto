
import React from 'react';

const LobbyScreen = ({ roomId, playerName, players, isHost, onStart }) => {

    return (
        <div className="lobby-screen" style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Sala de Espera</h1>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '500px',
                margin: '0 auto',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ color: 'var(--color-primary)' }}>Código de Sala:</h2>
                <div style={{
                    border: '2px dashed var(--color-accent)',
                    padding: '1rem',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    letterSpacing: '5px',
                    margin: '1rem 0'
                }}>
                    {roomId}
                </div>

                <p>Comparte este código con tus amigos para que se unan.</p>

                <div className="players-list" style={{ marginTop: '2rem', textAlign: 'left' }}>
                    <h3 style={{ color: 'var(--color-secondary)' }}>Jugadores ({players.length}):</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {players.map(p => (
                            <li key={p.id} style={{
                                padding: '10px',
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: p.name === playerName ? 'bold' : 'normal' }}>
                                    {p.name} {p.name === playerName ? '(Tú)' : ''}
                                </span>
                                {p.isHost && <span style={{ fontSize: '1rem', background: '#FFD700', padding: '2px 6px', borderRadius: '4px' }}>Host</span>}
                            </li>
                        ))}
                    </ul>
                </div>

                {isHost ? (
                    <>
                        <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                            <label style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '1rem' }}>Dificultad (Velocidad):</label>
                            <select
                                id="difficulty"
                                style={{ padding: '14px', borderRadius: '20px', fontSize: '1.1rem' }}
                                defaultValue="normal"
                            >
                                <option value="easy">Fácil</option>
                                <option value="normal">Normal</option>
                                <option value="hard">Difícil</option>
                            </select>
                        </div>
                        <button
                            onClick={() => {
                                const diff = document.getElementById('difficulty').value;
                                onStart(diff);
                            }}
                            style={{ width: '100%', marginTop: '1rem', fontSize: '1.5rem' }}
                        >
                            Comenzar Juego
                        </button>
                    </>
                ) : (
                    <p style={{ marginTop: '2rem', fontStyle: 'italic', color: '#666' }}>
                        Esperando a que el anfitrión inicie la partida...
                    </p>
                )}
            </div>
        </div>
    );
};

export default LobbyScreen;
