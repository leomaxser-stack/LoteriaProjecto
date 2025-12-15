import React from 'react';
import Card from './Card';

const Board = ({ cards, markedCards, onToggleMark, onShowInfo }) => {
    return (
        <div className="card-grid">
            {cards.map(card => (
                <Card
                    key={card.id}
                    card={card}
                    isMarked={markedCards.has(card.id)}
                    onToggle={() => onToggleMark(card.id)}
                    onShowInfo={onShowInfo}
                />
            ))}
        </div>
    );
};

export default Board;
