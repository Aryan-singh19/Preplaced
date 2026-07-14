import React from 'react';
import '../styles/ReviewCard.css'

const ReviewCard = ({ name, review, rating, image }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <img src={image || 'https://via.placeholder.com/50'} alt={name} className="user-img" />
        <div>
          <h4>{name}</h4>
          <div className="stars">{'⭐'.repeat(rating)}</div>
        </div>
      </div>
       <p className="review-text">"{review}"</p>
    </div>
  
  );
};

export default ReviewCard;