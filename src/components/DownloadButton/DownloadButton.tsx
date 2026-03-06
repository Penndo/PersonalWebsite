import { motion } from 'framer-motion';
import './DownloadButton.less';

interface DownloadButtonProps {
  onClick?: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick }) => {
  return (
    <motion.button 
      className="download-button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <span className="button-text">下载简历及作品集</span>
    </motion.button>
  );
};

export default DownloadButton;
