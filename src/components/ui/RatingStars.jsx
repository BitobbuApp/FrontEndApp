import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating, showValue = true, size = 'sm' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizes[size]} ${
            star <= Math.round(rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-slate-200'
          }`}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-slate-600">
          {rating?.toFixed(1) || '0.0'}
        </span>
      )}
    </div>
  );
}
