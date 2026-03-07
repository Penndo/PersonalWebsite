import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, TabNav, Card } from '@/components';
import { mockProjects, mockArticles, mockPlugins } from '@/services/mock';
import type { TabType, Project, Article, Plugin } from '@/types';
import './Products.less';

const Products: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('works');
  const [projects] = useState<Project[]>(mockProjects);
  const [articles] = useState<Article[]>(mockArticles);
  const [plugins] = useState<Plugin[]>(mockPlugins);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // setProjects(mockProjects);
    // setArticles(mockArticles);
    // setPlugins(mockPlugins);
    
    // Avoid calling setLoading(true) directly to prevent cascading renders
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const renderContent = () => {
    if (activeTab === 'works') {
      return (
        <div className="works-grid">
          {Array.isArray(projects) && projects.map((project, index) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card
                title={project.title}
                description={project.description}
                cover={project.cover || `https://picsum.photos/400/300?random=${index}`}
                variant="vertical"
                onClick={() => console.log('Project clicked:', project.id)}
              />
            </motion.div>
          ))}
        </div>
      );
    }

    if (activeTab === 'articles') {
      return (
        <div className="articles-list">
          {Array.isArray(articles) && articles.map((article, index) => (
            <motion.div key={article.id} variants={itemVariants}>
              <Card
                title={article.title}
                description={article.description}
                cover={article.cover || `https://picsum.photos/200/150?random=${index + 10}`}
                variant="horizontal"
                onClick={() => console.log('Article clicked:', article.id)}
              />
            </motion.div>
          ))}
        </div>
      );
    }

    if (activeTab === 'plugins') {
      return (
        <div className="plugins-grid">
          {Array.isArray(plugins) && plugins.map((plugin, index) => (
            <motion.div key={plugin.id} variants={itemVariants}>
              <Card
                title={plugin.title}
                description={plugin.description}
                cover={plugin.cover || `https://picsum.photos/300/200?random=${index + 20}`}
                variant="vertical"
                onClick={() => console.log('Plugin clicked:', plugin.id)}
              />
            </motion.div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <section className="products">
      <Header />
      
      <motion.div 
        className="products-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </motion.div>

      <div className="products-content">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              className="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="loading-spinner"></div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {renderContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Products;
