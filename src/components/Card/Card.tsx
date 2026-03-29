import { motion } from 'framer-motion';
import { useState } from 'react';
import './Card.less';

interface CardProps {
  title: string;
  description?: string;
  cover?: string;
  variant?: 'vertical' | 'horizontal';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  cover, 
  variant = 'vertical',
  onClick 
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  
  console.log('Card received props:', { title, cover, variant });
  
  const handleImageError = () => {
    console.error('Image failed to load:', cover);
    setImgError(true);
  };
  
  const handleImageLoad = () => {
    console.log('Image loaded successfully:', cover);
    setImgLoaded(true);
  };
  
  return (
    <motion.div 
      className={`card card-${variant}`}
      onClick={onClick}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {cover && !imgError && (
        <div className="card-cover">
          <img 
            src={cover} 
            alt={title} 
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imgLoaded ? 'block' : 'none' }}
          />
          {!imgLoaded && (
            <div className="card-cover-placeholder">
              <div className="loading-spinner" />
            </div>
          )}
        </div>
      )}
      {(!cover || imgError) && (
        <div className="card-cover card-cover-error">
          <div className="error-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <span>图片加载失败</span>
          </div>
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </motion.div>
  );
};

export default Card;
