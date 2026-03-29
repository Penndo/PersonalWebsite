import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, TabNav, Card } from '@/components';
import { tabsApi, projectApi, articleApi, pluginApi } from '@/services/api';
import type { TabType, Project, Article, Plugin } from '@/types';
import './Products.less';

interface ProductsProps {
  currentSection: 'home' | 'products';
}

const Products: React.FC<ProductsProps> = ({ currentSection }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState<Array<{ key: TabType; label: string }>>([
    { key: 'works', label: '作品' },
    { key: 'articles', label: '文章' },
    { key: 'plugins', label: '插件' },
  ]);
  const [activeTab, setActiveTab] = useState<TabType>('works');

  useEffect(() => {
    tabsApi.getTabs()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const sortedTabs = res.data
            .filter((t) => t.enabled)
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((t) => ({ key: t.key, label: t.label }));
          setTabs(sortedTabs);
          // 设置第一个标签为默认活动标签
          
          const savedTab = sessionStorage.getItem('activeTab');
          if (savedTab && sortedTabs.some(t => t.key === savedTab)) {
            setActiveTab(savedTab);
          } else if (sortedTabs.length > 0) {
            // 设置第一个标签为默认活动标签
            setActiveTab(sortedTabs[0].key);
          }
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
          (projectsRes.data || []).map((p) => {
            const cover = p.cover || p.coverUrl;
            console.log('Project cover data:', { id: p.id, title: p.title, cover, pCover: p.cover, pCoverUrl: p.coverUrl });
            return {
              ...p,
              id: String(p.id),
              description: p.description || p.summary,
              cover: cover,
            };
          }),
        );
        setArticles(
          (articlesRes.data || []).map((a) => {
            const cover = a.cover || a.coverUrl;
            console.log('Article cover data:', { id: a.id, title: a.title, cover, aCover: a.cover, aCoverUrl: a.coverUrl });
            return {
              ...a,
              id: String(a.id),
              description: a.description || a.summary,
              cover: cover,
              date: a.date || (a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : undefined),
            };
          }),
        );
        setPlugins(
          (pluginsRes.data || []).map((p) => {
            const cover = p.cover || p.coverUrl;
            console.log('Plugin cover data:', { id: p.id, title: p.title, cover, pCover: p.cover, pCoverUrl: p.coverUrl });
            return {
              ...p,
              id: String(p.id),
              description: p.description || p.summary,
              cover: cover,
              link: p.link || p.downloadUrl || p.repositoryUrl,
            };
          }),
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

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setLoading(true);
    setActiveTab(tab);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // 如果有保存的滚动位置，尝试恢复
      const savedScroll = sessionStorage.getItem('scrollPosition');
      if (savedScroll) {
        // 稍微延迟一下确保内容已渲染
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedScroll, 10),
            behavior: 'instant'
          });
          sessionStorage.removeItem('scrollPosition');
        }, 50);
      }
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
                onClick={() => {
                  sessionStorage.setItem('scrollPosition', window.scrollY.toString());
                  sessionStorage.setItem('activeTab', activeTab);
                  navigate(`/project/${project.id}`);
                }}
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
                onClick={() => {
                  sessionStorage.setItem('scrollPosition', window.scrollY.toString());
                  sessionStorage.setItem('activeTab', activeTab);
                  navigate(`/article/${article.id}`);
                }}
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
                onClick={() => {
                  sessionStorage.setItem('scrollPosition', window.scrollY.toString());
                  sessionStorage.setItem('activeTab', activeTab);
                  navigate(`/plugin/${plugin.id}`);
                }}
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
      
      {currentSection === 'products' && (
        <div className="products-header">
          <TabNav activeTab={activeTab} onTabChange={handleTabChange} tabs={tabs} />
        </div>
      )}

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
