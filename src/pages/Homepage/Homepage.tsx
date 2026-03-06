import { motion } from 'framer-motion';
import { Header, DownloadButton } from '@/components';
import type { UserInfo } from '@/types';
import './Homepage.less';

interface HomepageProps {
  userInfo: UserInfo;
  onScrollDown: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ userInfo, onScrollDown }) => {
  return (
    <section className="homepage">
      <Header />
      
      <div className="homepage-content">
        <motion.div 
          className="avatar-section"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="avatar-wrapper">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Yeatfish" 
              alt={userInfo.name}
            />
          </div>
          <motion.h1 
            className="user-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {userInfo.name}
          </motion.h1>
          <motion.div 
            className="user-tags"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="tag">{userInfo.profession} 💼</span>
            <span className="tag">{userInfo.age} 🌍</span>
            {userInfo.hobbies.map((hobby, index) => (
              <span key={index} className="tag">{hobby} 🏀</span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* <div className="intro-wrapper"> */}
            <div className="floating-icons-left">
              <motion.div 
                className="floating-icon icon-hooinn"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <img src="/icons/HooInn-Default.png" alt="HooInn" className="icon-default" />
                <img src="/icons/HooInn-hover.png" alt="HooInn Hover" className="icon-hover" />
              </motion.div>
              <motion.div 
                className="floating-icon icon-kaiyun"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <img src="/icons/开运-Default.png" alt="开运" className="icon-default" />
                <img src="/icons/开运-hover.png" alt="开运 Hover" className="icon-hover" />
              </motion.div>
            </div>

            <div className="intro-card">
              <div className="intro-layer intro-layer-1"></div>
              <div className="intro-layer intro-layer-2"></div>
              <div className="intro-content">
                <h2 className="intro-title">👋 欢迎光临！</h2>
                <p className="intro-text">{userInfo.introduction}</p>
              </div>
            </div>

            <div className="floating-icons-right">
              <motion.div 
                className="floating-icon icon-pub"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <img src="/icons/PUB-Default.png" alt="PUB" className="icon-default" />
                <img src="/icons/PUB-Hover.png" alt="PUB Hover" className="icon-hover" />
              </motion.div>
              <motion.div 
                className="floating-icon icon-ezc"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <img src="/icons/EZC-Default.png" alt="EZC" className="icon-default" />
                <img src="/icons/EZC-Hover.png" alt="EZC Hover" className="icon-hover" />
              </motion.div>
            </div>
          {/* </div> */}
        </motion.div>

        <motion.div 
          className="download-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <DownloadButton onClick={() => console.log('Download clicked')} />
        </motion.div>
      </div>

      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        onClick={onScrollDown}
      >
        <motion.div 
          className="scroll-arrow"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="rgba(255, 255, 255, 0.88)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
        <span className="scroll-text">下滑，了解更多</span>
      </motion.div>
    </section>
  );
};

export default Homepage;
