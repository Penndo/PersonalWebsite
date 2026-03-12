import { motion } from 'framer-motion';
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
  return (
    <motion.div 
      className={`card card-${variant}`}
      onClick={onClick}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {cover && (
        <div className="card-cover">
          <img src={cover} alt={title} />
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
