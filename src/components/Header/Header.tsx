import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.less';

interface HeaderProps {
  logo?: string;
  onLogoClick?: () => void;
  userInfo?: {
    phone?: string;
    wechatQRCode?: string;
    avatar?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, userInfo }) => {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
      return;
    }
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.header 
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-logo" onClick={handleLogoClick}>
        <div className="logo-avatar">
          <img 
            src={userInfo?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Yeatfish"} 
            alt="Logo"
          />
        </div>
      </div>
      <motion.div 
        className="header-menu"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowContact(true)}
        onMouseLeave={() => setShowContact(false)}
      >
        <div className="menu-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2"/>
            <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {showContact && userInfo && (
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {userInfo.phone && (
              <div className="contact-item">
                <span className="contact-label">电话:</span>
                <span className="contact-value">{userInfo.phone}</span>
              </div>
            )}
            {userInfo.wechatQRCode && (
              <div className="contact-item">
                <span className="contact-label">微信:</span>
                <div className="wechat-qr">
                  <img src={userInfo.wechatQRCode} alt="微信二维码" />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.header>
  );
};

export default Header;
