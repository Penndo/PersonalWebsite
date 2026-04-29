import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import EditorForm from './EditorForm';
import MarkdownEditor from './MarkdownEditor';
import { projectApi, articleApi, pluginApi } from '@/services/api';
import './Editor.less';

type EditorType = 'project' | 'article' | 'plugin';

const VALID_TYPES: readonly EditorType[] = ['project', 'article', 'plugin'];
const TYPE_LABEL: Record<EditorType, string> = {
  project: '项目',
  article: '文章',
  plugin: '插件',
};

interface EditorProps {
  /** 仅作向后兼容：实际类型来自路由参数 :type */
  type?: EditorType;
}

const Editor: React.FC<EditorProps> = ({ type: typeProp }) => {
  const navigate = useNavigate();
  const { type: typeParam, id } = useParams<{ type?: string; id?: string }>();

  /** 真实的 EditorType 始终来自 URL；prop 仅作兜底 */
  const type = useMemo<EditorType>(() => {
    const candidate = typeParam ?? typeProp;
    if (candidate && (VALID_TYPES as readonly string[]).includes(candidate)) {
      return candidate as EditorType;
    }
    return 'project';
  }, [typeParam, typeProp]);

  const typeLabel = TYPE_LABEL[type];

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
    const candidate = typeParam ?? typeProp;
    if (candidate && !(VALID_TYPES as readonly string[]).includes(candidate)) {
      message.error(`未知的编辑类型：${candidate}`);
      navigate(-1);
    }
  }, [typeParam, typeProp, navigate]);

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

      if (id) {
        switch (type) {
          case 'project':
            await projectApi.updateProject(id, data);
            break;
          case 'article':
            await articleApi.updateArticle(id, data);
            break;
          case 'plugin':
            await pluginApi.updatePlugin(id, data);
            break;
        }
        message.success(`${typeLabel}更新成功`);
      } else {
        switch (type) {
          case 'project':
            await projectApi.createProject(data);
            break;
          case 'article':
            await articleApi.createArticle(data);
            break;
          case 'plugin':
            await pluginApi.createPlugin(data);
            break;
        }
        message.success(`${typeLabel}创建成功`);
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
        <div className="editor-header-left">
          <Button
            className="editor-back-btn"
            icon={<ArrowLeftOutlined />}
            onClick={handleCancel}
            type="text"
          >
            {/* 返回 */}
          </Button>
          <h1>{id ? '编辑' : '新建'}{typeLabel}</h1>
        </div>
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