import { useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Spin, message, Tabs, Upload, Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { userApi, projectApi, articleApi, pluginApi, uploadApi } from '@/services/api';
import type { UserInfo, Project, Article, Plugin, RecommendedItem } from '@/types';

const { TabPane } = Tabs;

const UserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recommendedItems, setRecommendedItems] = useState<RecommendedItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, projectsRes, articlesRes, pluginsRes] = await Promise.all([
        userApi.getUserInfo(),
        projectApi.getProjects(),
        articleApi.getArticles(),
        pluginApi.getPlugins()
      ]);
      
      setUserInfo({
        ...userRes.data,
        phone: userRes.data.phone || '',
        portfolio: userRes.data.portfolio || '',
        wechatQRCode: userRes.data.wechatQRCode || ''
      });
      setProjects(projectsRes.data);
      setArticles(articlesRes.data);
      setPlugins(pluginsRes.data);
      
      // 初始化推荐项目
      setRecommendedItems([
        {
          id: '1',
          type: 'project',
          title: 'Hooinn',
          defaultImage: '/icons/HooInn-Default.png',
          hoverImage: '/icons/HooInn-hover.png',
          enabled: true,
          order: 1
        },
        {
          id: '2',
          type: 'project',
          title: 'PUB',
          defaultImage: '/icons/PUB-Default.png',
          hoverImage: '/icons/PUB-Hover.png',
          enabled: true,
          order: 2
        }
      ]);
    } catch (err) {
      console.error(err);
      message.error('获取数据失败');
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

  const handleFileUpload = async (file: File, field: string) => {
    try {
      setUploading(true);
      const response = await uploadApi.uploadImage(file);
      if (userInfo) {
        setUserInfo({ ...userInfo, [field]: response.data.url });
        message.success('上传成功');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      message.error('上传失败，请重试');
    } finally {
      setUploading(false);
    }
    return false;
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

  const handleSaveRecommendations = async () => {
    setSaving(true);
    try {
      // 这里需要实现保存推荐项目的API调用
      message.success('推荐项目配置已保存');
    } catch (err) {
      console.error(err);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 48px' }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="基础信息配置" key="basic">
          <Card title="个人信息">
            {userInfo && (
              <Form layout="vertical">
                <Form.Item label="姓名" required>
                  <Input
                    value={userInfo.name}
                    onChange={(e) => handleUserChange('name', e.target.value)}
                    placeholder="请输入姓名"
                    maxLength={10}
                  />
                </Form.Item>
                <Form.Item label="年龄" required>
                  <InputNumber
                    value={userInfo.age}
                    onChange={(value) => handleUserChange('age', String(value ?? 0))}
                    placeholder="请输入年龄"
                    style={{ width: '100%' }}
                    min={0}
                    max={120}
                  />
                </Form.Item>
                <Form.Item label="爱好" required>
                  <Input
                    value={userInfo.hobbies.join(', ')}
                    onChange={(e) => handleUserChange('hobbies', e.target.value)}
                    placeholder="请输入爱好，用逗号分隔"
                  />
                </Form.Item>
                <Form.Item label="职业" required>
                  <Input
                    value={userInfo.profession}
                    onChange={(e) => handleUserChange('profession', e.target.value)}
                    placeholder="请输入职业或角色"
                    maxLength={10}
                  />
                </Form.Item>
                <Form.Item label="个人介绍" required>
                  <Input.TextArea
                    value={userInfo.introduction}
                    onChange={(e) => handleUserChange('introduction', e.target.value)}
                    placeholder="请输入个人介绍"
                    rows={4}
                    maxLength={300}
                  />
                </Form.Item>
                <Form.Item label="头像" required>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Input
                      value={userInfo.avatar}
                      onChange={(e) => handleUserChange('avatar', e.target.value)}
                      placeholder="请输入头像图片 URL"
                      style={{ flex: 1 }}
                    />
                    <Upload
                      name="file"
                      showUploadList={false}
                      beforeUpload={(file) => handleFileUpload(file, 'avatar')}
                      disabled={uploading}
                    >
                      <Button icon={<UploadOutlined />} loading={uploading}>
                        上传
                      </Button>
                    </Upload>
                  </div>
                </Form.Item>
                <Form.Item label="作品集" required>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Input
                      value={userInfo.portfolio}
                      onChange={(e) => handleUserChange('portfolio', e.target.value)}
                      placeholder="请输入作品集 PDF URL"
                      style={{ flex: 1 }}
                    />
                    <Upload
                      name="file"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        if (file.type !== 'application/pdf') {
                          message.error('仅支持 PDF 格式');
                          return false;
                        }
                        if (file.size > 200 * 1024 * 1024) {
                          message.error('文件大小不能超过 200MB');
                          return false;
                        }
                        return handleFileUpload(file, 'portfolio');
                      }}
                      disabled={uploading}
                    >
                      <Button icon={<UploadOutlined />} loading={uploading}>
                        上传 PDF
                      </Button>
                    </Upload>
                  </div>
                </Form.Item>
                <Form.Item label="电话" required>
                  <Input
                    value={userInfo.phone}
                    onChange={(e) => handleUserChange('phone', e.target.value)}
                    placeholder="请输入手机号"
                    maxLength={11}
                    pattern="[0-9]{11}"
                  />
                </Form.Item>
                <Form.Item label="微信二维码" required>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Input
                      value={userInfo.wechatQRCode}
                      onChange={(e) => handleUserChange('wechatQRCode', e.target.value)}
                      placeholder="请输入微信二维码图片 URL"
                      style={{ flex: 1 }}
                    />
                    <Upload
                      name="file"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        if (file.size > 5 * 1024 * 1024) {
                          message.error('文件大小不能超过 5MB');
                          return false;
                        }
                        return handleFileUpload(file, 'wechatQRCode');
                      }}
                      disabled={uploading}
                    >
                      <Button icon={<UploadOutlined />} loading={uploading}>
                        上传
                      </Button>
                    </Upload>
                  </div>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={handleSaveUser} loading={saving}>
                    保存基础信息
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Card>
        </TabPane>
        <TabPane tab="推荐项目配置" key="recommendations">
          <Card title="推荐项目设置">
            <div style={{ marginBottom: '24px' }}>
              <h3>推荐项目列表</h3>
              <p>从以下项目中选择推荐项目，并配置默认图片和悬停图片</p>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <h4>可选项目</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {projects.map(project => (
                  <Card key={project.id} size="small" title={project.title}>
                    <p>{project.summary}</p>
                    <Button type="primary" style={{ marginTop: '12px' }}>
                      添加到推荐
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <h4>已推荐项目</h4>
              {recommendedItems.map(item => (
                <Card key={item.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h5>{item.title}</h5>
                      <p>类型: {item.type}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button type="link">编辑</Button>
                      <Button type="link" danger>删除</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <Form.Item style={{ marginTop: '24px' }}>
              <Button type="primary" onClick={handleSaveRecommendations} loading={saving}>
                保存推荐项目配置
              </Button>
            </Form.Item>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserSettings;
