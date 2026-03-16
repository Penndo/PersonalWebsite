import { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Spin,
  message,
  Table,
  Space,
  Popconfirm,
  Modal,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { pluginApi } from '@/services/api';
import type { Plugin } from '@/types';

const { Title } = Typography;

const PluginsManage: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlugin, setEditingPlugin] = useState<Plugin | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPlugins();
  }, []);

  const fetchPlugins = async () => {
    setLoading(true);
    try {
      const res = await pluginApi.getPlugins();
      setPlugins(res.data);
    } catch (err) {
      console.error(err);
      message.error('获取插件列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: Record<string, string | undefined>) => {
    setSaving(true);
    try {
      const pluginData = {
        ...values,
        tags: values.tags?.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) || [],
      };

      if (editingPlugin?.id) {
        const res = await pluginApi.updatePlugin(editingPlugin.id, pluginData);
        setPlugins((prev) =>
          prev.map((p) => (p.id === editingPlugin.id ? res.data : p))
        );
        message.success('插件更新成功');
      } else {
        const res = await pluginApi.createPlugin(pluginData);
        setPlugins((prev) => [...prev, res.data]);
        message.success('插件创建成功');
      }
      setIsModalOpen(false);
      setEditingPlugin(null);
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
      await pluginApi.deletePlugin(id);
      setPlugins((prev) => prev.filter((p) => p.id !== id));
      message.success('插件删除成功');
    } catch (err) {
      console.error(err);
      message.error('删除失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const openModal = (plugin?: Plugin) => {
    if (plugin) {
      setEditingPlugin(plugin);
      form.setFieldsValue({
        ...plugin,
        tags: Array.isArray(plugin.tags) ? plugin.tags.join(', ') : plugin.tags,
      });
    } else {
      setEditingPlugin(null);
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
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (version: string) => version || '-',
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
      render: (_: unknown, record: Plugin) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="确认删除"
            description="确定要删除这个插件吗？"
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
      <div className="loading-container">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <>
      <Title level={4} className="admin-page-title">插件管理</Title>

      <Card
        className="admin-card"
        variant="borderless"
        extra={
          <Button type="primary" onClick={() => openModal()}>
            新增插件
          </Button>
        }
      >
        <Table
          dataSource={plugins}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingPlugin ? '编辑插件' : '新增插件'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingPlugin(null);
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
            <Input placeholder="请输入插件标题" />
          </Form.Item>
          <Form.Item
            name="routeId"
            label="路由ID"
            rules={[{ required: true, message: '请输入路由ID' }]}
          >
            <Input placeholder="请输入路由ID（唯一标识）" />
          </Form.Item>
          <Form.Item name="version" label="版本">
            <Input placeholder="请输入版本号，如 v1.0.0" />
          </Form.Item>
          <Form.Item
            name="summary"
            label="摘要"
            rules={[{ required: true, message: '请输入摘要' }]}
          >
            <Input.TextArea placeholder="请输入插件摘要" rows={2} />
          </Form.Item>
          <Form.Item name="content" label="内容">
            <Input.TextArea placeholder="请输入插件详细内容" rows={4} />
          </Form.Item>
          <Form.Item name="coverUrl" label="封面图片 URL">
            <Input placeholder="请输入封面图片 URL" />
          </Form.Item>
          <Form.Item name="repositoryUrl" label="仓库地址">
            <Input placeholder="请输入代码仓库地址" />
          </Form.Item>
          <Form.Item name="downloadUrl" label="下载地址">
            <Input placeholder="请输入下载地址" />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Input placeholder="请输入标签，用逗号分隔" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PluginsManage;
