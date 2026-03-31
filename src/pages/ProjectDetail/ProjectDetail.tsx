import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { getProjectDetail } from '@/services/api';
import type { ProjectDetail as ProjectDetailType } from '@/types';
import './ProjectDetail.less';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        console.log('Fetching project with id:', id);
        const data = await getProjectDetail(id);
        console.log('Project data received:', data);
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        // 即使出错也显示错误状态
      } finally {
        setLoading(false);
        console.log('Fetch project completed');
      }
    };

    fetchProject();
  }, [id]);

  const handleBack = () => {
    navigate('/#works');
  };

  const handlePrevImage = () => {
    if (project && project.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (project && project.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading) {
    return (
      <div className="project-detail">
        <Header />
        <div className="project-detail-loading">
          <motion.div 
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail">
        <Header />
        <div className="project-detail-error">
          <h2>项目未找到</h2>
          <p>找不到ID为 {id} 的项目</p>
          <button onClick={handleBack}>返回列表</button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <Header />
      
      <motion.div 
        className="project-detail-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="project-actions">
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

          {project.link && (
            <motion.a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>查看项目</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
          )}
        </div>

        <div className="project-hero">
          <motion.h1 
            className="project-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {project.title}
          </motion.h1>
          
          <motion.div 
            className="project-tags"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {project.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </motion.div>

          <motion.p 
            className="project-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {project.summary}
          </motion.p>
        </div>

        <div className="project-gallery">
          <div className="gallery-main">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                className="gallery-image-wrapper"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={project.images[currentImageIndex]} 
                  alt={`${project.title} - ${currentImageIndex + 1}`}
                />
              </motion.div>
            </AnimatePresence>

            {project.images.length > 1 && (
              <>
                <button className="gallery-nav prev" onClick={handlePrevImage}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="gallery-nav next" onClick={handleNextImage}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
          </div>

          <div className="gallery-thumbnails">
            {project.images.map((image, index) => (
              <motion.button
                key={index}
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={image} alt={`${project.title} - ${index + 1}`} />
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div 
          className="project-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <SyntaxHighlighter
                    {...props}
                    children={String(children).replace(/\n$/, '')}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                  />
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {project.content || project.background || ''}
          </ReactMarkdown>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProjectDetail;
