import { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Spin,
  message,
  Table,
  Space,
  Popconfirm,
  Modal,
  Upload,
  Image,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { articleApi, uploadApi } from '@/services/api';
import type { Article } from '@/types';

const ArticlesManage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [form] = Form.useForm();

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

  const handleSave = async (values: Record<string, string | undefined>) => {
    setSaving(true);
    try {
      const articleData = {
        ...values,
        tags: values.tags?.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) || [],
      };

      if (editingArticle?.id) {
        const res = await articleApi.updateArticle(editingArticle.id, articleData);
        setArticles((prev) =>
          prev.map((a) => (a.id === editingArticle.id ? res.data : a))
        );
        message.success('文章更新成功');
      } else {
        const res = await articleApi.createArticle(articleData);
        setArticles((prev) => [...prev, res.data]);
        message.success('文章创建成功');
      }
      setIsModalOpen(false);
      setEditingArticle(null);
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
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

  const openModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      form.setFieldsValue({
        ...article,
        tags: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags,
      });
    } else {
      setEditingArticle(null);
      form.resetFields();
    }
    setIsModalOpen(true);
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
            onClick={() => openModal(record)}
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
    <>
      <Card
        title="文章管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
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

      <Modal
        title={editingArticle ? '编辑文章' : '新增文章'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingArticle(null);
          form.resetFields();
        }}
        confirmLoading={saving}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>
          <Form.Item
            name="routeId"
            label="路由ID"
            rules={[{ required: true, message: '请输入路由ID' }]}
          >
            <Input placeholder="请输入路由ID（唯一标识）" />
          </Form.Item>
          <Form.Item
            name="summary"
            label="摘要"
            rules={[{ required: true, message: '请输入摘要' }]}
          >
            <Input.TextArea placeholder="请输入文章摘要" rows={2} />
          </Form.Item>
          <Form.Item name="content" label="内容">
            <Input.TextArea placeholder="请输入文章详细内容" rows={4} />
          </Form.Item>
          <Form.Item name="coverUrl" label="封面图片">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.coverUrl !== currentValues.coverUrl}
              >
                {({ getFieldValue }) => {
                  const coverUrl = getFieldValue('coverUrl');
                  return coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt="封面预览"
                      style={{ width: 120, height: 80, objectFit: 'cover', marginBottom: '8px' }}
                    />
                  ) : null;
                }}
              </Form.Item>
              <Upload.Dragger
                name="file"
                multiple={false}
                beforeUpload={async (file) => {
                  try {
                    const response = await uploadApi.uploadImage(file);
                    form.setFieldsValue({ coverUrl: response.data.url });
                    message.success('图片上传成功');
                  } catch (error) {
                    message.error('图片上传失败，请重试');
                  }
                  return false; // 阻止自动上传
                }}
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
                <p className="ant-upload-hint">
                  支持 JPG、PNG 等格式，文件大小不超过 2MB
                </p>
              </Upload.Dragger>
              <Input
                placeholder="或直接输入图片 URL"
                value={form.getFieldValue('coverUrl')}
                onChange={(e) => form.setFieldsValue({ coverUrl: e.target.value })}
              />
            </div>
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Input placeholder="请输入标签，用逗号分隔" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ArticlesManage;
