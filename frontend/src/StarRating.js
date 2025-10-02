// frontend/src/StarRating.js

import React from 'react';

const StarRating = ({ rating } ) => {
  const stars = [];
  const totalStars = 5;

  for (let i = 1; i <= totalStars; i++) {
    if (i <= rating) {
      // Eğer 'i' puandan küçük veya eşitse, DOLU YILDIZ ekle
      stars.push(<i key={`full_${i}`} className="fa-solid fa-star"></i>);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      // Eğer 'i' puanın yuvarlanmış haline eşitse ve puan tam sayı değilse, YARIM YILDIZ ekle
      stars.push(<i key="half" className="fa-solid fa-star-half-stroke"></i>);
    } else {
      // Geri kalan durumlar için BOŞ YILDIZ ekle
      stars.push(<i key={`empty_${i}`} className="fa-regular fa-star"></i>);
    }
  }

  return <div className="star-container">{stars}</div>;
};

export default StarRating;
