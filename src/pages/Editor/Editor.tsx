import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { message, Spin } from 'antd';
import EditorForm from './EditorForm';
import MarkdownEditor from './MarkdownEditor';
import { projectApi, articleApi, pluginApi } from '@/services/api';
import './Editor.less';

type EditorType = 'project' | 'article' | 'plugin';

interface EditorProps {
  type: EditorType;
}

const Editor: React.FC<EditorProps> = ({ type }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    routeId: '',
    summary: '',
    coverUrl: '',
    tags: [] as string[],
    content: '',
  });

  useEffect(() => {
    if (id) {
      fetchItem(id);
    } else {
      setLoading(false);
    }
  }, [id, type]);

  const fetchItem = async (itemId: string) => {
    setLoading(true);
    try {
      let response;
      switch (type) {
        case 'project':
          response = await projectApi.getProjectById(itemId);
          break;
        case 'article':
          response = await articleApi.getArticleById(itemId);
          break;
        case 'plugin':
          response = await pluginApi.getPluginById(itemId);
          break;
      }

      if (response?.data) {
        const data = response.data;
        setFormData({
          title: data.title || '',
          routeId: data.routeId || '',
          summary: data.summary || '',
          coverUrl: data.coverUrl || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
          content: data.content || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch item:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...formData,
        tags: formData.tags,
      };

      let response;
      if (id) {
        switch (type) {
          case 'project':
            response = await projectApi.updateProject(id, data);
            break;
          case 'article':
            response = await articleApi.updateArticle(id, data);
            break;
          case 'plugin':
            response = await pluginApi.updatePlugin(id, data);
            break;
        }
        message.success('更新成功');
      } else {
        switch (type) {
          case 'project':
            response = await projectApi.createProject(data);
            break;
          case 'article':
            response = await articleApi.createArticle(data);
            break;
          case 'plugin':
            response = await pluginApi.createPlugin(data);
            break;
        }
        message.success('创建成功');
      }

      navigate(-1);
    } catch (error) {
      console.error('Failed to save:', error);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="editor-loading">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <motion.div
      className="editor-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="editor-header">
        <h1>{id ? '编辑' : '新建'}{type === 'project' ? '项目' : type === 'article' ? '文章' : '插件'}</h1>
      </div>
      
      <div className="editor-content">
        <EditorForm
          formData={formData}
          setFormData={setFormData}
          type={type}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
        
        <MarkdownEditor
          content={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
        />
      </div>
    </motion.div>
  );
};

export default Editor;