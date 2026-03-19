import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, TabNav, Card } from '@/components';
import { tabsApi, projectApi, articleApi, pluginApi } from '@/services/api';
import type { TabType, Project, Article, Plugin } from '@/types';
import './Products.less';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState<Array<{ key: TabType; label: string }>>([
    { key: 'works', label: '作品' },
    { key: 'articles', label: '文章' },
    { key: 'plugins', label: '插件' },
  ]);

  useEffect(() => {
    tabsApi.getTabs()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setTabs(
            res.data
              .filter((t) => t.enabled)
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((t) => ({ key: t.key, label: t.label })),
          );
        }
      })
      .catch((err) => {
        console.error('Failed to fetch tabs', err);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchLists = async () => {
      try {
        const [projectsRes, articlesRes, pluginsRes] = await Promise.all([
          projectApi.getProjects(),
          articleApi.getArticles(),
          pluginApi.getPlugins(),
        ]);

        if (cancelled) return;

        setProjects(
          (projectsRes.data || []).map((p) => ({
            ...p,
            id: String(p.id),
            description: p.description || p.summary,
            cover: p.cover || p.coverUrl,
          })),
        );
        setArticles(
          (articlesRes.data || []).map((a) => ({
            ...a,
            id: String(a.id),
            description: a.description || a.summary,
            cover: a.cover || a.coverUrl,
            date: a.date || (a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : undefined),
          })),
        );
        setPlugins(
          (pluginsRes.data || []).map((p) => ({
            ...p,
            id: String(p.id),
            description: p.description || p.summary,
            cover: p.cover || p.coverUrl,
            link: p.link || p.downloadUrl || p.repositoryUrl,
          })),
        );
      } catch (err) {
        console.error('Failed to fetch lists', err);
      }
    };

    fetchLists();

    return () => {
      cancelled = true;
    };
  }, []);

  const hashKey = location.hash.startsWith('#') ? location.hash.slice(1) : '';
  const defaultTab = tabs[0]?.key || 'works';
  const activeTab = tabs.some((t) => t.key === hashKey) ? hashKey : defaultTab;

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setLoading(true);
    navigate(`#${tab}`, { replace: true });
  };

  useEffect(() => {
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
                onClick={() => navigate(`/project/${project.id}`)}
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
                onClick={() => navigate(`/article/${article.id}`)}
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
                onClick={() => navigate(`/plugin/${plugin.id}`)}
              />
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <div style={{ padding: 48, textAlign: 'center', opacity: 0.8 }}>
        暂无内容
      </div>
    );
  };

  return (
    <section className="products">
      <Header />
      
      <div className="products-header">
        <TabNav activeTab={activeTab} onTabChange={handleTabChange} tabs={tabs} />
      </div>

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
