// frontend/src/ProductCard.js
import React, { useState } from 'react'; // useState'in import edildiğinden emin ol
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState('yellow');
  const ratingValue = product.popularityScore * 5;

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const availableColors = Object.keys(product.images);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.images[selectedColor]} alt={product.name} className="product-image" />
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price} USD</p>
      
      {/* --- BU BÖLÜM EKSİK OLABİLİR --- */}
      <div className="color-picker">
        {availableColors.map(color => (
          <div
            key={color}
            className={`color-dot ${selectedColor === color ? 'active' : ''}`}
            style={{ 
              backgroundColor: color === 'yellow' ? '#E6CA97' : (color === 'white' ? '#D9D9D9' : '#E1A4A0') 
            }}
            onClick={() => handleColorChange(color)}
          />
        ))}
      </div>
      {/* --- BİTİŞ --- */}

      <div className="product-rating">
        <StarRating rating={ratingValue} />
        <span className="rating-text">{ratingValue.toFixed(1)}/5</span>
      </div>
    </div>
  );
};

export default ProductCard;
