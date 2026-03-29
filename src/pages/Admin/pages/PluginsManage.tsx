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
import { pluginApi } from '@/services/api';
import type { Plugin } from '@/types';

const PluginsManage: React.FC = () => {
  const navigate = useNavigate();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const openEditor = (plugin?: Plugin) => {
    if (plugin) {
      navigate(`/admin/editor/plugin/${plugin.id}`);
    } else {
      navigate(`/admin/editor/plugin`);
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
            onClick={() => openEditor(record)}
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
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <Card
      title="插件管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor()}>
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
  );
};

export default PluginsManage;