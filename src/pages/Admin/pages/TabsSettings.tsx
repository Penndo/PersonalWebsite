import { useEffect, useState } from 'react';
import { Card, Input, Switch, Button, Spin, message, Space, Table, Popconfirm } from 'antd';
import { tabsApi } from '@/services/api';
import type { TabType } from '@/types';

interface TabFormItem {
  id: string;
  key: TabType;
  label: string;
  order: number;
  enabled: boolean;
}

const TabsSettings: React.FC = () => {
  const [tabs, setTabs] = useState<TabFormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTabs();
  }, []);

  const fetchTabs = async () => {
    setLoading(true);
    try {
      const res = await tabsApi.getTabs();
      setTabs(
        (res.data || [])
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((item) => ({
            id: item.key,
            ...item,
          })),
      );
    } catch (err) {
      console.error(err);
      message.error('获取导航配置失败');
    } finally {
      setLoading(false);
    }
  };

  const updateTabById = (
    id: string,
    patch: Partial<Pick<TabFormItem, 'key' | 'label' | 'enabled'>>,
  ) => {
    setTabs((prev) => prev.map((tab) => (tab.id === id ? { ...tab, ...patch } : tab)));
  };

  const handleSaveTabs = async () => {
    const trimmedKeys = tabs.map((t) => (typeof t.key === 'string' ? t.key.trim() : String(t.key).trim()));
    const hasEmptyKey = trimmedKeys.some((k) => k.length === 0);
    if (hasEmptyKey) {
      message.error('请为所有导航填写 Key');
      return;
    }
    const hasEmptyLabel = tabs.some((t) => t.label.trim().length === 0);
    if (hasEmptyLabel) {
      message.error('请为所有导航填写显示名称');
      return;
    }
    const keySet = new Set<string>();
    const hasDuplicateKey = trimmedKeys.some((k) => {
      if (keySet.has(k)) return true;
      keySet.add(k);
      return false;
    });
    if (hasDuplicateKey) {
      message.error('Key 不能重复');
      return;
    }

    setSaving(true);
    try {
      const normalizedTabs = tabs
        .map((t) => ({
          ...t,
          key: (typeof t.key === 'string' ? t.key.trim() : String(t.key).trim()) as TabType,
          label: t.label.trim(),
        }))
        .map((t, index) => ({ ...t, order: index + 1 }));

      const res = await tabsApi.updateTabs(
        normalizedTabs.map((t) => ({
          key: t.key,
          label: t.label,
          order: t.order,
          enabled: t.enabled,
        })),
      );
      setTabs(
        (res.data || []).map((item) => ({
          id: item.key,
          ...item,
        })),
      );
      message.success('导航配置已保存');
    } catch (err) {
      console.error(err);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTab = () => {
    const id = `new_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    setTabs((prev) => [
      ...prev,
      {
        id,
        key: '',
        label: '',
        order: prev.length + 1,
        enabled: true,
      },
    ]);
  };

  const handleDeleteTab = (id: string) => {
    setTabs((prev) => prev.filter((t) => t.id !== id));
  };

  const moveRowById = (id: string, direction: 'up' | 'down') => {
    setTabs((prev) => {
      const index = prev.findIndex((t) => t.id === id);
      if (index < 0) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = prev.slice();
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <>
      <Card title="导航配置">
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={handleAddTab}>新增导航</Button>
          <Button type="primary" onClick={handleSaveTabs} loading={saving}>
            保存导航配置
          </Button>
        </Space>

        <Table<TabFormItem>
          dataSource={tabs}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: '没有标签数据' }}
          columns={[
            {
              title: 'Key',
              dataIndex: 'key',
              width: 200,
              render: (_value, record) => (
                <Input
                  value={record.key}
                  onChange={(e) => updateTabById(record.id, { key: e.target.value })}
                  placeholder="例如：works"
                />
              ),
            },
            {
              title: '显示名称',
              dataIndex: 'label',
              render: (_value, record) => (
                <Input
                  value={record.label}
                  onChange={(e) => updateTabById(record.id, { label: e.target.value })}
                  placeholder="例如：作品"
                />
              ),
            },
            {
              title: '启用',
              dataIndex: 'enabled',
              width: 100,
              render: (_value, record) => (
                <Switch checked={record.enabled} onChange={(checked) => updateTabById(record.id, { enabled: checked })} />
              ),
            },
            {
              title: '排序',
              dataIndex: 'order',
              width: 80,
              render: (_value, _record, index) => index + 1,
            },
            {
              title: '操作',
              key: 'actions',
              width: 220,
              render: (_value, record) => (
                <Space>
                  <Button onClick={() => moveRowById(record.id, 'up')}>上移</Button>
                  <Button onClick={() => moveRowById(record.id, 'down')}>下移</Button>
                  <Popconfirm
                    title="确认删除该导航？"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={() => handleDeleteTab(record.id)}
                  >
                    <Button danger>删除</Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
};

export default TabsSettings;
