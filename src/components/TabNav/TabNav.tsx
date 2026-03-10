import { motion } from 'framer-motion';
import type { TabType } from '@/types';
import './TabNav.less';

interface DynamicTab {
  key: TabType;
  label: string;
}

interface TabNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  tabs: DynamicTab[];
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <motion.nav 
      className="tab-nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {tabs.map((tab) => (
        <motion.div
          key={tab.key}
          className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabChange(tab.key)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {activeTab === tab.key && (
            <motion.div
              className="tab-active-bg"
              layoutId="activeTab"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="tab-label">{tab.label}</span>
        </motion.div>
      ))}
    </motion.nav>
  );
};

export default TabNav;
