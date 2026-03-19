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
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { projectApi } from '@/services/api';
import type { Project } from '@/types';

const ProjectsManage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await projectApi.getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      message.error('获取项目列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: Record<string, string | undefined>) => {
    setSaving(true);
    try {
      const projectData = {
        ...values,
        tags: values.tags?.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) || [],
      };

      if (editingProject?.id) {
        const res = await projectApi.updateProject(editingProject.id, projectData);
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? res.data : p))
        );
        message.success('项目更新成功');
      } else {
        const res = await projectApi.createProject(projectData);
        setProjects((prev) => [...prev, res.data]);
        message.success('项目创建成功');
      }
      setIsModalOpen(false);
      setEditingProject(null);
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
      await projectApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      message.success('项目删除成功');
    } catch (err) {
      console.error(err);
      message.error('删除失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      form.setFieldsValue({
        ...project,
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
      });
    } else {
      setEditingProject(null);
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
      render: (_: unknown, record: Project) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="确认删除"
            description="确定要删除这个项目吗？"
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
        title="项目管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            新增项目
          </Button>
        }
      >
        <Table
          dataSource={projects}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingProject ? '编辑项目' : '新增项目'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingProject(null);
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
            <Input placeholder="请输入项目标题" />
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
            <Input.TextArea placeholder="请输入项目摘要" rows={2} />
          </Form.Item>
          <Form.Item name="content" label="内容">
            <Input.TextArea placeholder="请输入项目详细内容" rows={4} />
          </Form.Item>
          <Form.Item name="coverUrl" label="封面图片 URL">
            <Input placeholder="请输入封面图片 URL" />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Input placeholder="请输入标签，用逗号分隔" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectsManage;
