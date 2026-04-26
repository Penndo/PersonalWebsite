import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header, GradientBackground, DynamicParticles } from '@/components';
import { getArticleDetail } from '@/services/api';
import type { ArticleDetail as ArticleDetailType } from '@/types';
import './ArticleDetail.less';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getArticleDetail(id);
        setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleBack = () => {
    navigate('/#articles');
  };

  if (loading) {
    return (
      <div className="article-detail">
        <GradientBackground />
        <DynamicParticles />
        <Header />
        <div className="article-detail-loading">
          <motion.div 
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-detail">
        <GradientBackground />
        <DynamicParticles />
        <Header />
        <div className="article-detail-error">
          <h2>文章未找到</h2>
          <button onClick={handleBack}>返回列表</button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <GradientBackground />
      <DynamicParticles />
      <Header />
      
      <motion.div 
        className="article-detail-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="article-actions">
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

          {article.link && (
            <motion.a 
              href={article.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="article-link"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>阅读原文</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
          )}
        </div>

        <div className="article-hero">
          <motion.h1 
            className="article-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {article.title}
          </motion.h1>
          
          <motion.div 
            className="article-meta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="meta-date">{article.date}</span>
            <span className="meta-divider">·</span>
            <span className="meta-reading-time">{article.readingTime} 分钟阅读</span>
            <span className="meta-divider">·</span>
            <span className="meta-views">{article.views} 次浏览</span>
          </motion.div>

          <motion.div 
            className="article-tags"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {article.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </motion.div>
        </div>

        {article.cover && (
          <motion.div 
            className="article-cover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <img src={article.cover} alt={article.title} />
          </motion.div>
        )}

        <motion.div 
          className="article-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <motion.div 
          className="article-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="author-info">
            <div className="author-avatar">
              <img src={article.author.avatar} alt={article.author.name} />
            </div>
            <div className="author-details">
              <span className="author-name">{article.author.name}</span>
              <span className="author-bio">{article.author.bio}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ArticleDetail;
