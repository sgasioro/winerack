import React, { useState } from 'react';
import { Wine } from '../types/wine';

interface WineCardProps {
  wine: Wine;
}

const WineCard: React.FC<WineCardProps> = ({ wine }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Calculate position to prevent clipping
  const getCardPosition = () => {
    const cardWidth = 200;
    const cardHeight = 115;
    const padding = 10;
    
    let left = mousePosition.x - cardWidth;
    let top = mousePosition.y - cardHeight;
    
    // Prevent left edge clipping
    if (left < padding) {
      left = mousePosition.x + padding; // Position to the right of cursor instead
    }
    
    // Prevent right edge clipping
    if (left + cardWidth > window.innerWidth - padding) {
      left = window.innerWidth - cardWidth - padding;
    }
    
    // Prevent top edge clipping
    if (top < padding) {
      top = mousePosition.y + padding; // Position below cursor instead
    }
    
    // Prevent bottom edge clipping
    if (top + cardHeight > window.innerHeight - padding) {
      top = window.innerHeight - cardHeight - padding;
    }
    
    return { left, top };
  };

  const cardPosition = getCardPosition();

  return (
    <div 
      className="wine-card" 
      onMouseMove={handleMouseMove}
    >
      <div className="wine-card-default">
        {wine.Winery}
      </div>
      <div 
        className="wine-card-details" 
        style={{ 
          left: `${cardPosition.left}px`, 
          top: `${cardPosition.top}px` 
        }}
      >
        <h3>{wine.Winery}</h3>
        <p>{wine.Name}</p>
        <p>{wine.Style}</p>
        <p>{wine.Vintage}</p>
        <p>{wine.Region}</p>
      </div>
    </div>
  );
};

export default WineCard;