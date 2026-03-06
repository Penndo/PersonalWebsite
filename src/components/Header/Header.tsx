import { motion } from 'framer-motion';
import './Header.less';

interface HeaderProps {
  logo?: string;
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <motion.header 
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-logo" onClick={onLogoClick}>
        <div className="logo-avatar">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Yeatfish" 
            alt="Logo"
          />
        </div>
      </div>
      <motion.div 
        className="header-menu"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="menu-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2"/>
            <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
