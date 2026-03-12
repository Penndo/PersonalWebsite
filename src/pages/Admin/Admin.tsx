import { useEffect, useState } from 'react';
import { tabsApi, userApi, projectApi, articleApi, pluginApi } from '@/services/api';
import type { UserInfo, TabType, Project, Article, Plugin } from '@/types';
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
  Layout,
  Menu,
  Avatar,
  Badge,
  Tooltip,
  Typography,
  Space,
} from 'antd';
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SettingOutlined,
  BarChartOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import './Admin.less';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface TabFormItem {
  key: TabType;
  label: string;
  order: number;
  enabled: boolean;
}

const Admin: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [tabs, setTabs] = useState<TabFormItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string>('1');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, tabsRes, projectsRes, articlesRes, pluginsRes] = await Promise.all([
          userApi.getUserInfo(),
          tabsApi.getTabs(),
          projectApi.getProjects(),
          articleApi.getArticles(),
          pluginApi.getPlugins(),
        ]);
        setUserInfo(userRes.data);
        setTabs(tabsRes.data);
        setProjects(projectsRes.data);
        setArticles(articlesRes.data);
        setPlugins(pluginsRes.data);
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
      const res = await tabsApi.updateTabs(tabs);
      setTabs(res.data);
      message.success('选项卡配置已保存');
    } catch (err) {
      console.error(err);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    setProjects(prev => prev.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    ));
  };

  const handleSaveProject = async (project: Project) => {
    setSaving(true);
    try {
      const projectData = { ...project };
      if (typeof (projectData as any).tags === 'string') {
        (projectData as any).tags = (projectData as any).tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
      }
      let res;
      if (project.id) {
        res = await projectApi.updateProject(project.id, projectData);
      } else {
        res = await projectApi.createProject(projectData);
      }
      setProjects(prev => {
        const index = prev.findIndex(p => p.id === project.id);
        if (index >= 0) {
          const newProjects = [...prev];
          newProjects[index] = res.data;
          return newProjects;
        } else {
          return [...prev, res.data];
        }
      });
      message.success('项目保存成功');
    } catch (err) {
      console.error(err);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setSaving(true);
    try {
      await projectApi.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      message.success('项目删除成功');
    } catch (err) {
      console.error(err);
      message.error('删除失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleArticleChange = (index: number, field: keyof Article, value: string) => {
    setArticles(prev => prev.map((article, i) => 
      i === index ? { ...article, [field]: value } : article
    ));
  };

  const handleSaveArticle = async (article: Article) => {
    setSaving(true);
    try {
      const articleData = { ...article };
      if (typeof (articleData as any).tags === 'string') {
        (articleData as any).tags = (articleData as any).tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
      }
      let res;
      if (article.id) {
        res = await articleApi.updateArticle(article.id, articleData);
      } else {
        res = await articleApi.createArticle(articleData);
      }
      setArticles(prev => {
        const index = prev.findIndex(a => a.id === article.id);
        if (index >= 0) {
          const newArticles = [...prev];
          newArticles[index] = res.data;
          return newArticles;
        } else {
          return [...prev, res.data];
        }
      });
      message.success('文章保存成功');
    } catch (err) {
      console.error(err);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    setSaving(true);
    try {
      await articleApi.deleteArticle(id);
      setArticles(prev => prev.filter(a => a.id !== id));
      message.success('文章删除成功');
    } catch (err) {
      console.error(err);
      message.error('删除失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handlePluginChange = (index: number, field: keyof Plugin, value: string) => {
    setPlugins(prev => prev.map((plugin, i) => 
      i === index ? { ...plugin, [field]: value } : plugin
    ));
  };

  const handleSavePlugin = async (plugin: Plugin) => {
    setSaving(true);
    try {
      const pluginData = { ...plugin };
      if (typeof (pluginData as any).tags === 'string') {
        (pluginData as any).tags = (pluginData as any).tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
      }
      let res;
      if (plugin.id) {
        res = await pluginApi.updatePlugin(plugin.id, pluginData);
      } else {
        res = await pluginApi.createPlugin(pluginData);
      }
      setPlugins(prev => {
        const index = prev.findIndex(p => p.id === plugin.id);
        if (index >= 0) {
          const newPlugins = [...prev];
          newPlugins[index] = res.data;
          return newPlugins;
        } else {
          return [...prev, res.data];
        }
      });
      message.success('插件保存成功');
    } catch (err) {
      console.error(err);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlugin = async (id: string) => {
    setSaving(true);
    try {
      await pluginApi.deletePlugin(id);
      setPlugins(prev => prev.filter(p => p.id !== id));
      message.success('插件删除成功');
    } catch (err) {
      console.error(err);
      message.error('删除失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout className="admin-layout">
        <Sider trigger={null} collapsible collapsed={collapsed} className="admin-sider">
          <div className="admin-logo">
            <Text strong className="admin-logo-text">后台管理</Text>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[activeMenu]}
            onSelect={({ key }) => setActiveMenu(key)}
            items={[
              {
                key: '1',
                icon: <HomeOutlined />,
                label: '首页设置',
              },
              {
                key: '2',
                icon: <SettingOutlined />,
                label: '项目管理',
              },
              {
                key: '3',
                icon: <BarChartOutlined />,
                label: '文章管理',
              },
              {
                key: '4',
                icon: <UserSwitchOutlined />,
                label: '插件管理',
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header className="admin-header">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="admin-menu-trigger"
            />
            <div className="admin-header-right">
              <Space size="middle">
                <Badge dot={true}>
                  <Tooltip title="消息通知">
                    <Button type="text" icon={<UserOutlined />} />
                  </Tooltip>
                </Badge>
                <Avatar size="small" icon={<UserOutlined />} />
                <Text className="admin-username">管理员</Text>
                <Tooltip title="退出登录">
                  <Button type="text" icon={<LogoutOutlined />} />
                </Tooltip>
              </Space>
            </div>
          </Header>
          <Content className="admin-content">
            <div className="loading-container">
              <Spin size="large" tip="加载中..." />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout className="admin-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} className="admin-sider">
        <div className="admin-logo">
          <Text strong className="admin-logo-text">后台管理</Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeMenu]}
          onSelect={({ key }) => setActiveMenu(key)}
          items={[
            {
              key: '1',
              icon: <HomeOutlined />,
              label: '首页设置',
            },
            {
              key: '2',
              icon: <SettingOutlined />,
              label: '项目管理',
            },
            {
              key: '3',
              icon: <BarChartOutlined />,
              label: '文章管理',
            },
            {
              key: '4',
              icon: <UserSwitchOutlined />,
              label: '插件管理',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header className="admin-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="admin-menu-trigger"
          />
          <div className="admin-header-right">
            <Space size="middle">
              <Badge dot={true}>
                <Tooltip title="消息通知">
                  <Button type="text" icon={<UserOutlined />} />
                </Tooltip>
              </Badge>
              <Avatar size="small" icon={<UserOutlined />} />
              <Text className="admin-username">管理员</Text>
              <Tooltip title="退出登录">
                <Button type="text" icon={<LogoutOutlined />} />
              </Tooltip>
            </Space>
          </div>
        </Header>
        <Content className="admin-content">
          <div className="admin-content-inner">
            {activeMenu === '1' && (
              <>
                <Title level={4} className="admin-page-title">首页设置</Title>
                
                <Card 
                  title="用户信息" 
                  className="admin-card"
                  bordered={false}
                  style={{ marginBottom: 24 }}
                >
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
                          style={{ width: '100%'}}
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
                        bordered
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
              </>
            )}

            {activeMenu === '2' && (
              <>
                <Title level={4} className="admin-page-title">项目管理</Title>
                <Card className="admin-card" bordered={false}>
                  <div className="admin-items-list">
                    {projects.map((project, index) => (
                      <Card 
                        key={project.id} 
                        className="admin-item"
                        size="small"
                        style={{ marginBottom: 16 }}
                        bordered
                      >
                        <Form layout="vertical">
                          <Form.Item label="标题">
                            <Input
                              value={project.title}
                              onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                              placeholder="请输入项目标题"
                            />
                          </Form.Item>
                          <Form.Item label="路由ID">
                            <Input
                              value={(project as any).routeId}
                              onChange={(e) => handleProjectChange(index, 'routeId' as keyof Project, e.target.value)}
                              placeholder="请输入路由ID"
                            />
                          </Form.Item>
                          <Form.Item label="摘要">
                            <Input
                              value={(project as any).summary}
                              onChange={(e) => handleProjectChange(index, 'summary' as keyof Project, e.target.value)}
                              placeholder="请输入项目摘要"
                            />
                          </Form.Item>
                          <Form.Item label="内容">
                            <Input.TextArea
                              value={(project as any).content}
                              onChange={(e) => handleProjectChange(index, 'content' as keyof Project, e.target.value)}
                              placeholder="请输入项目内容"
                              rows={3}
                            />
                          </Form.Item>
                          <Form.Item label="封面URL">
                            <Input
                              value={(project as any).coverUrl}
                              onChange={(e) => handleProjectChange(index, 'coverUrl' as keyof Project, e.target.value)}
                              placeholder="请输入封面URL"
                            />
                          </Form.Item>
                          <Form.Item label="标签">
                            <Input
                              value={Array.isArray((project as any).tags) ? (project as any).tags.join(', ') : ''}
                              onChange={(e) => handleProjectChange(index, 'tags' as keyof Project, e.target.value)}
                              placeholder="请输入标签，用逗号分隔"
                            />
                          </Form.Item>
                          <Form.Item>
                            <Space>
                              <Button 
                                type="primary" 
                                onClick={() => handleSaveProject(project)}
                                loading={saving}
                              >
                                保存
                              </Button>
                              <Button 
                                danger 
                                onClick={() => handleDeleteProject(project.id)}
                                loading={saving}
                              >
                                删除
                              </Button>
                            </Space>
                          </Form.Item>
                        </Form>
                      </Card>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {activeMenu === '3' && (
              <>
                <Title level={4} className="admin-page-title">文章管理</Title>
                <Card className="admin-card" bordered={false}>
                  <div className="admin-items-list">
                    {articles.map((article, index) => (
                      <Card 
                        key={article.id} 
                        className="admin-item"
                        size="small"
                        style={{ marginBottom: 16 }}
                        bordered
                      >
                        <Form layout="vertical">
                          <Form.Item label="标题">
                            <Input
                              value={article.title}
                              onChange={(e) => handleArticleChange(index, 'title', e.target.value)}
                              placeholder="请输入文章标题"
                            />
                          </Form.Item>
                          <Form.Item label="路由ID">
                            <Input
                              value={(article as any).routeId}
                              onChange={(e) => handleArticleChange(index, 'routeId' as keyof Article, e.target.value)}
                              placeholder="请输入路由ID"
                            />
                          </Form.Item>
                          <Form.Item label="摘要">
                            <Input
                              value={(article as any).summary}
                              onChange={(e) => handleArticleChange(index, 'summary' as keyof Article, e.target.value)}
                              placeholder="请输入文章摘要"
                            />
                          </Form.Item>
                          <Form.Item label="内容">
                            <Input.TextArea
                              value={(article as any).content}
                              onChange={(e) => handleArticleChange(index, 'content' as keyof Article, e.target.value)}
                              placeholder="请输入文章内容"
                              rows={3}
                            />
                          </Form.Item>
                          <Form.Item label="封面URL">
                            <Input
                              value={(article as any).coverUrl}
                              onChange={(e) => handleArticleChange(index, 'coverUrl' as keyof Article, e.target.value)}
                              placeholder="请输入封面URL"
                            />
                          </Form.Item>
                          <Form.Item label="标签">
                            <Input
                              value={Array.isArray((article as any).tags) ? (article as any).tags.join(', ') : ''}
                              onChange={(e) => handleArticleChange(index, 'tags' as keyof Article, e.target.value)}
                              placeholder="请输入标签，用逗号分隔"
                            />
                          </Form.Item>
                          <Form.Item>
                            <Space>
                              <Button 
                                type="primary" 
                                onClick={() => handleSaveArticle(article)}
                                loading={saving}
                              >
                                保存
                              </Button>
                              <Button 
                                danger 
                                onClick={() => handleDeleteArticle(article.id)}
                                loading={saving}
                              >
                                删除
                              </Button>
                            </Space>
                          </Form.Item>
                        </Form>
                      </Card>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {activeMenu === '4' && (
              <>
                <Title level={4} className="admin-page-title">插件管理</Title>
                <Card className="admin-card" bordered={false}>
                  <div className="admin-items-list">
                    {plugins.map((plugin, index) => (
                      <Card 
                        key={plugin.id} 
                        className="admin-item"
                        size="small"
                        style={{ marginBottom: 16 }}
                        bordered
                      >
                        <Form layout="vertical">
                          <Form.Item label="标题">
                            <Input
                              value={plugin.title}
                              onChange={(e) => handlePluginChange(index, 'title', e.target.value)}
                              placeholder="请输入插件标题"
                            />
                          </Form.Item>
                          <Form.Item label="路由ID">
                            <Input
                              value={(plugin as any).routeId}
                              onChange={(e) => handlePluginChange(index, 'routeId' as keyof Plugin, e.target.value)}
                              placeholder="请输入路由ID"
                            />
                          </Form.Item>
                          <Form.Item label="摘要">
                            <Input
                              value={(plugin as any).summary}
                              onChange={(e) => handlePluginChange(index, 'summary' as keyof Plugin, e.target.value)}
                              placeholder="请输入插件摘要"
                            />
                          </Form.Item>
                          <Form.Item label="内容">
                            <Input.TextArea
                              value={(plugin as any).content}
                              onChange={(e) => handlePluginChange(index, 'content' as keyof Plugin, e.target.value)}
                              placeholder="请输入插件内容"
                              rows={3}
                            />
                          </Form.Item>
                          <Form.Item label="封面URL">
                            <Input
                              value={(plugin as any).coverUrl}
                              onChange={(e) => handlePluginChange(index, 'coverUrl' as keyof Plugin, e.target.value)}
                              placeholder="请输入封面URL"
                            />
                          </Form.Item>
                          <Form.Item label="仓库URL">
                            <Input
                              value={(plugin as any).repositoryUrl}
                              onChange={(e) => handlePluginChange(index, 'repositoryUrl' as keyof Plugin, e.target.value)}
                              placeholder="请输入仓库URL"
                            />
                          </Form.Item>
                          <Form.Item label="下载URL">
                            <Input
                              value={(plugin as any).downloadUrl}
                              onChange={(e) => handlePluginChange(index, 'downloadUrl' as keyof Plugin, e.target.value)}
                              placeholder="请输入下载URL"
                            />
                          </Form.Item>
                          <Form.Item label="版本">
                            <Input
                              value={(plugin as any).version}
                              onChange={(e) => handlePluginChange(index, 'version' as keyof Plugin, e.target.value)}
                              placeholder="请输入版本"
                            />
                          </Form.Item>
                          <Form.Item label="标签">
                            <Input
                              value={Array.isArray((plugin as any).tags) ? (plugin as any).tags.join(', ') : ''}
                              onChange={(e) => handlePluginChange(index, 'tags' as keyof Plugin, e.target.value)}
                              placeholder="请输入标签，用逗号分隔"
                            />
                          </Form.Item>
                          <Form.Item>
                            <Space>
                              <Button 
                                type="primary" 
                                onClick={() => handleSavePlugin(plugin)}
                                loading={saving}
                              >
                                保存
                              </Button>
                              <Button 
                                danger 
                                onClick={() => handleDeletePlugin(plugin.id)}
                                loading={saving}
                              >
                                删除
                              </Button>
                            </Space>
                          </Form.Item>
                        </Form>
                      </Card>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;

