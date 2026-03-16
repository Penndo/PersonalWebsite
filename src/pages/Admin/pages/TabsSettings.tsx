import { useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Switch, Button, Typography, Spin, message, Space } from 'antd';
import { tabsApi } from '@/services/api';
import type { TabType } from '@/types';

const { Title } = Typography;

interface TabFormItem {
  key: TabType;
  label: string;
  order: number;
  enabled: boolean;
}

const TabsSettings: React.FC = () => {
  const [tabs, setTabs] = useState<TabFormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  console.log('TabsSettings 组件初始化');

  useEffect(() => {
    console.log('调用 fetchTabs');
    fetchTabs();
  }, []);

  const fetchTabs = async () => {
    console.log('开始获取标签数据');
    setLoading(true);
    try {
      const res = await tabsApi.getTabs();
      console.log('获取标签数据成功:', res.data);
      setTabs(res.data);
      console.log('设置标签数据后，tabs 长度:', res.data.length);
    } catch (err) {
      console.error('获取标签数据失败:', err);
      message.error('获取导航配置失败');
    } finally {
      setLoading(false);
      console.log('加载状态设置为 false');
    }
  };

  const handleTabChange = (index: number, field: keyof TabFormItem, value: string | number | boolean) => {
    setTabs((prev) =>
      prev.map((tab, i) =>
        i === index ? { ...tab, [field]: value } : tab,
      ),
    );
  };

  const handleSaveTabs = async () => {
    setSaving(true);
    try {
      const res = await tabsApi.updateTabs(tabs);
      setTabs(res.data);
      message.success('导航配置已保存');
    } catch (err) {
      console.error(err);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  console.log('TabsSettings 渲染，tabs:', tabs);

  return (
    <>
      <Title level={4} className="admin-page-title">导航配置</Title>

      <Card title="Tab 导航配置" className="admin-card" variant="borderless">
        <div className="admin-tabs-list">
          {tabs.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              没有标签数据
            </div>
          ) : (
            tabs.map((tab, index) => (
              <Card key={tab.key} className="admin-tab-item" size="small" style={{ marginBottom: 16 }} variant="outlined">
                <Form layout="vertical">
                  <Form.Item label="Key" style={{ marginBottom: 8 }}>
                    <Input value={tab.key} disabled />
                  </Form.Item>
                  <Form.Item label="显示名称" style={{ marginBottom: 8 }}>
                    <Input
                      value={tab.label}
                      onChange={(e) => handleTabChange(index, 'label', e.target.value)}
                      placeholder="请输入显示名称"
                    />
                  </Form.Item>
                  <Form.Item label="排序" style={{ marginBottom: 8 }}>
                    <InputNumber
                      value={tab.order}
                      onChange={(value) => handleTabChange(index, 'order', value ?? 0)}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                      <span>启用:</span>
                      <Switch
                        checked={tab.enabled}
                        onChange={(checked) => handleTabChange(index, 'enabled', checked)}
                      />
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            ))
          )}
        </div>
        <Button type="primary" onClick={handleSaveTabs} loading={saving}>
          保存导航配置
        </Button>
      </Card>
    </>
  );
};

export default TabsSettings;
