import React from 'react';

const Card = ({ card, isMarked, onToggle, onShowInfo }) => {
    return (
        <div className={`card ${isMarked ? 'marked' : ''}`} onClick={onToggle}>
            <span className="card-number">{card.id}</span>

            <img
                src={card.image}
                alt={card.name}
                className="card-image"
                loading="lazy"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.style.backgroundColor = '#eee';
                    // Add a fallback text or icon if needed
                }}
            />

            <div className="card-name">{card.name}</div>

            {isMarked && <div className="frijolito"></div>}

            <button
                className="info-btn"
                onClick={(e) => { e.stopPropagation(); onShowInfo(card); }}
                title="Ver información"
            >
                i
            </button>
        </div>
    );
};

export default Card;
