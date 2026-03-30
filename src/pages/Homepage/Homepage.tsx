import { motion } from 'framer-motion';
import { Header, DownloadButton } from '@/components';
import type { UserInfo, RecommendedItem } from '@/types';
import './Homepage.less';

interface HomepageProps {
  userInfo: UserInfo;
  recommendedItems?: RecommendedItem[];
  onScrollDown: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ userInfo, recommendedItems = [], onScrollDown }) => {
  // 按顺序排序推荐项目
  const sortedItems = [...recommendedItems].sort((a, b) => a.order - b.order);
  
  // 分为左右两列
  const leftItems = sortedItems.filter((_, index) => index % 2 === 0);
  const rightItems = sortedItems.filter((_, index) => index % 2 === 1);

  return (
    <section className="homepage">
      <Header userInfo={userInfo} />
      
      <div className="homepage-content">
        <motion.div 
          className="avatar-section"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="avatar-wrapper">
            <img 
              src={userInfo.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Yeatfish"} 
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
            {(userInfo.hobbies ?? []).map((hobby, index) => (
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
          <div className="floating-icons-left">
            {leftItems.map((item, index) => (
              <motion.div 
                key={item.id}
                className={`floating-icon icon-${item.title.toLowerCase()}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <img src={item.defaultImage} alt={item.title} className="icon-default" />
                <img src={item.hoverImage} alt={`${item.title} Hover`} className="icon-hover" />
              </motion.div>
            ))}
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
            {rightItems.map((item, index) => (
              <motion.div 
                key={item.id}
                className={`floating-icon icon-${item.title.toLowerCase()}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <img src={item.defaultImage} alt={item.title} className="icon-default" />
                <img src={item.hoverImage} alt={`${item.title} Hover`} className="icon-hover" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="download-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <DownloadButton onClick={() => {
            if (userInfo.portfolio) {
              window.open(userInfo.portfolio, '_blank');
            } else {
              console.log('No portfolio URL available');
            }
          }} />
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
        {/* <span className="scroll-text">下滑，了解更多</span> */}
      </motion.div>
    </section>
  );
};

export default Homepage;
