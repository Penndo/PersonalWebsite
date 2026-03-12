import { useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Typography, Spin, message } from 'antd';
import { userApi } from '@/services/api';
import type { UserInfo } from '@/types';

const { Title } = Typography;

const UserSettings: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const res = await userApi.getUserInfo();
      setUserInfo(res.data);
    } catch (err) {
      console.error(err);
      message.error('获取用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (field: keyof UserInfo, value: string) => {
    if (!userInfo) return;
    let newValue: string | string[] | number = value;

    if (field === 'hobbies') {
      newValue = value.split(',').map(h => h.trim()).filter(h => h.length > 0);
    } else if (field === 'age') {
      newValue = parseInt(value, 10) || 0;
    }

    setUserInfo({ ...userInfo, [field]: newValue } as UserInfo);
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

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <>
      <Title level={4} className="admin-page-title">用户设置</Title>

      <Card title="用户信息" className="admin-card" bordered={false}>
        {userInfo && (
          <Form layout="vertical">
            <Form.Item label="姓名">
              <Input
                value={userInfo.name}
                onChange={(e) => handleUserChange('name', e.target.value)}
                placeholder="请输入姓名"
              />
            </Form.Item>
            <Form.Item label="年龄">
              <InputNumber
                value={userInfo.age}
                onChange={(value) => handleUserChange('age', String(value ?? 0))}
                placeholder="请输入年龄"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label="爱好">
              <Input
                value={userInfo.hobbies.join(', ')}
                onChange={(e) => handleUserChange('hobbies', e.target.value)}
                placeholder="请输入爱好，用逗号分隔"
              />
            </Form.Item>
            <Form.Item label="职业">
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
            <Form.Item label="头像 URL">
              <Input
                value={userInfo.avatar}
                onChange={(e) => handleUserChange('avatar', e.target.value)}
                placeholder="请输入头像图片 URL"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSaveUser} loading={saving}>
                保存用户信息
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </>
  );
};

export default UserSettings;
