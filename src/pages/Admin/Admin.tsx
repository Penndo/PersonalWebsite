import { useEffect, useState } from 'react';
import { Header } from '@/components';
import { tabsApi, userApi } from '@/services/api';
import type { UserInfo, TabType } from '@/types';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Divider,
  message,
  Spin,
} from 'antd';
import './Admin.less';

interface TabFormItem {
  key: TabType;
  label: string;
  order: number;
  enabled: boolean;
}

const Admin: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [tabs, setTabs] = useState<TabFormItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, tabsRes] = await Promise.all([
          userApi.getUserInfo(),
          tabsApi.getTabs(),
        ]);
        setUserInfo(userRes.data);
        setTabs(tabsRes.data);
      } catch (err) {
        console.error(err);
        message.error('获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserChange = (
    field: keyof UserInfo,
    value: string,
  ) => {
    if (!userInfo) return;
    setUserInfo({ ...userInfo, [field]: value } as UserInfo);
  };

  const handleSaveUser = async () => {
    if (!userInfo) return;
    setSaving(true);
    try {
      const res = await userApi.updateUserInfo(userInfo);
      setUserInfo(res.data);
      message.success('用户信息已保存');
    } catch (err) {
      console.error(err);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (
    index: number,
    field: keyof TabFormItem,
    value: string | number | boolean,
  ) => {
    setTabs((prev) =>
      prev.map((tab, i) =>
        i === index ? { ...tab, [field]: value } : tab,
      ),
    );
  };

  const handleSaveTabs = async () => {
    setSaving(true);
    try {
      await tabsApi.getTabs(); // placeholder if PUT implemented later
      message.info('当前 Demo 仅展示读取功能，如需完整写入可在后端开放 PUT /tabs');
    } catch (err) {
      console.error(err);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <Header />
        <main className="admin-main">
          <div className="loading-container">
            <Spin size="large" tip="加载中..." />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main">
        <Card 
          title="首页用户信息" 
          className="admin-card"
          bordered={false}
        >
          {userInfo && (
            <Form layout="vertical">
              <Form.Item label="显示名称">
                <Input
                  value={userInfo.name}
                  onChange={(e) => handleUserChange('name', e.target.value)}
                  placeholder="请输入显示名称"
                />
              </Form.Item>
              <Form.Item label="职业 / 角色">
                <Input
                  value={userInfo.profession}
                  onChange={(e) => handleUserChange('profession', e.target.value)}
                  placeholder="请输入职业或角色"
                />
              </Form.Item>
              <Form.Item label="个人介绍">
                <Input.TextArea
                  value={userInfo.introduction}
                  onChange={(e) => handleUserChange('introduction', e.target.value)}
                  placeholder="请输入个人介绍"
                  rows={4}
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  onClick={handleSaveUser}
                  loading={saving}
                >
                  保存用户信息
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>

        <Divider />

        <Card 
          title="Tab 导航配置" 
          className="admin-card"
          bordered={false}
        >
          <div className="admin-tabs-list">
            {tabs.map((tab, index) => (
              <Card 
                key={tab.key} 
                className="admin-tab-item"
                size="small"
                style={{ marginBottom: 16 }}
              >
                <Form layout="horizontal">
                  <Form.Item label="标签文案" style={{ flex: 1, marginRight: 16 }}>
                    <Input
                      value={tab.label}
                      onChange={(e) =>
                        handleTabChange(
                          index,
                          'label',
                          e.target.value,
                        )
                      }
                      placeholder="请输入标签文案"
                    />
                  </Form.Item>
                  <Form.Item label="排序" style={{ width: 120, marginRight: 16 }}>
                    <InputNumber
                      value={tab.order}
                      onChange={(value) =>
                        handleTabChange(
                          index,
                          'order',
                          value || 0,
                        )
                      }
                      min={0}
                    />
                  </Form.Item>
                  <Form.Item label="启用" style={{ width: 100 }}>
                    <Switch
                      checked={tab.enabled}
                      onChange={(checked) =>
                        handleTabChange(
                          index,
                          'enabled',
                          checked,
                        )
                      }
                    />
                  </Form.Item>
                </Form>
              </Card>
            ))}
          </div>
          <Button 
            type="primary" 
            onClick={handleSaveTabs}
            loading={saving}
          >
            保存 Tab 配置
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default Admin;

