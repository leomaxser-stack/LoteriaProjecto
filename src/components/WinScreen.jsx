import React from 'react';

const WinScreen = ({ winner, onRestart }) => {
    const isNoWinner = !winner;

    return (
        <div className="win-screen">
            <div className="win-content">
                {isNoWinner ? (
                    <>
                        <h1 style={{ fontSize: '4rem', color: '#e74c3c', textShadow: '2px 2px 0px #c0392b' }}>¡JUEGO TERMINADO!</h1>
                        <h2 style={{ color: '#5066b689' }}>Se acabaron las cartas y nadie ganó.</h2>
                        <img
                            src="https://i.ibb.co/2YW7D5vm/frijolito-Perdedor-Fondo.png"
                            alt="Nadie ganó"
                            style={{ maxWidth: '400px', width: '100%', height: 'auto', borderRadius: '15px', margin: '20px auto', display: 'block', boxShadow: '0 8px 16px rgba(0,0,0,0)' }}
                        />
                        {/* ============================================== */}
                    </>
                ) : (
                    <>
                        <h1 style={{ fontSize: '4rem', color: 'var(--color-primary)', textShadow: '2px 2px 0px var(--color-accent)' }}>¡LOTERÍA!</h1>
                        <h2 style={{ color: 'var(--color-secondary)' }}>¡Felicidades {winner}, has ganado!</h2>
                        <img
                            src="https://i.ibb.co/VWsgSDQ8/frijolito-Ganador-fondo.png"
                            alt="Ganador"
                            style={{ maxWidth: '540px', width: '100%', height: 'auto', borderRadius: '15px', margin: '20px auto', display: 'block', boxShadow: '0 8px 16px rgba(0,0,0,0)' }}
                        />
                        {/* ============================================= */}
                    </>
                )}
                <button onClick={onRestart} style={{ marginTop: '20px', fontSize: '1.5rem' }}>Jugar de Nuevo</button>
            </div>
        </div>
    );
};

export default WinScreen;
