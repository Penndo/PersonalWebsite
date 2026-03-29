import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Spin,
  message,
  Table,
  Space,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { articleApi } from '@/services/api';
import type { Article } from '@/types';

const ArticlesManage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await articleApi.getArticles();
      setArticles(res.data);
    } catch (err) {
      console.error(err);
      message.error('获取文章列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await articleApi.deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      message.success('文章删除成功');
    } catch (err) {
      console.error(err);
      message.error('删除失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const openEditor = (article?: Article) => {
    if (article) {
      navigate(`/admin/editor/article/${article.id}`);
    } else {
      navigate(`/admin/editor/article`);
    }
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '路由ID',
      dataIndex: 'routeId',
      key: 'routeId',
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => tags?.join(', ') || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Article) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditor(record)}
          />
          <Popconfirm
            title="确认删除"
            description="确定要删除这篇文章吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <Card
      title="文章管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor()}>
          新增文章
        </Button>
      }
    >
      <Table
        dataSource={articles}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default ArticlesManage;