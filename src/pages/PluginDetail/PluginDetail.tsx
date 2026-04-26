import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header, GradientBackground, DynamicParticles } from '@/components';
import { getPluginDetail } from '@/services/api';
import type { PluginDetail as PluginDetailType } from '@/types';
import './PluginDetail.less';

const PluginDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plugin, setPlugin] = useState<PluginDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPlugin = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getPluginDetail(id);
        setPlugin(data);
      } catch (error) {
        console.error('Failed to fetch plugin:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlugin();
  }, [id]);

  const handleBack = () => {
    navigate('/#plugins');
  };

  if (loading) {
    return (
      <div className="plugin-detail">
        <GradientBackground />
        <DynamicParticles />
        <Header />
        <div className="plugin-detail-loading">
          <motion.div 
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    );
  }

  if (!plugin) {
    return (
      <div className="plugin-detail">
        <GradientBackground />
        <DynamicParticles />
        <Header />
        <div className="plugin-detail-error">
          <h2>插件未找到</h2>
          <button onClick={handleBack}>返回列表</button>
        </div>
      </div>
    );
  }

  return (
    <div className="plugin-detail">
      <GradientBackground />
      <DynamicParticles />
      <Header />
      
      <motion.div 
        className="plugin-detail-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="plugin-actions">
          <motion.button 
            className="back-button"
            onClick={handleBack}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>返回</span>
          </motion.button>

          {plugin.link && (
            <motion.a 
              href={plugin.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="plugin-link"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>访问插件</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
          )}
        </div>

        <div className="plugin-header">
          {plugin.cover && (
            <div className="plugin-cover">
              <img src={plugin.cover} alt={plugin.title} />
            </div>
          )}
          <div className="plugin-info">
            <h1 className="plugin-title">{plugin.title}</h1>
            <p className="plugin-description">{plugin.description}</p>
            
            <div className="plugin-meta">
              <span className="meta-item">版本 {plugin.version}</span>
              <span className="meta-divider">·</span>
              <span className="meta-item">{plugin.downloads.toLocaleString()} 次下载</span>
              <span className="meta-divider">·</span>
              <span className="meta-item rating">★ {plugin.rating}</span>
            </div>

            <div className="plugin-tags">
              {plugin.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="plugin-section">
          <h2 className="section-title">功能特性</h2>
          <ul className="feature-list">
            {plugin.features.map((feature, index) => (
              <li key={index} className="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {plugin.screenshots.length > 0 && (
          <div className="plugin-section">
            <h2 className="section-title">截图预览</h2>
            <div className="screenshots-grid">
              {plugin.screenshots.map((screenshot, index) => (
                <motion.div 
                  key={index} 
                  className="screenshot-item"
                  whileHover={{ scale: 1.02 }}
                >
                  <img src={screenshot} alt={`截图 ${index + 1}`} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="plugin-footer">
          <div className="author-info">
            <div className="author-avatar">
              <img src={plugin.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(plugin.author.name)}&background=ffb730&color=fff`} alt={plugin.author.name} />
            </div>
            <div className="author-details">
              <span className="author-name">{plugin.author.name}</span>
              <span className="author-label">插件作者</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PluginDetail;
