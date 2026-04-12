import { useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Spin, message, Tabs, Upload, Modal, Select, UploadFile } from 'antd';
const { Option, OptGroup } = Select;
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { userApi, projectApi, articleApi, pluginApi, uploadApi, recommendationApi } from '@/services/api';
import type { UserInfo, Project, Article, Plugin, RecommendedItem } from '@/types';
// @ts-ignore
import ImgCrop from 'antd-img-crop';

const { TabPane } = Tabs;

/** 用表单字段存图片 URL，通过 value/onChange 与 Form 绑定，保证上传后与再次打开时的预览、回显正常 */
type RecommendationImageUploadProps = {
  value?: string;
  onChange?: (url: string) => void;
  crop?: boolean;
};

const RecommendationImageUpload: React.FC<RecommendationImageUploadProps> = ({
  value,
  onChange,
  crop,
}) => {
  const fileList: UploadFile[] = value
    ? [
        {
          uid: '-1',
          name: value.split('/').pop() || 'image.png',
          status: 'done',
          url: value,
          thumbUrl: value,
        },
      ]
    : [];

  const upload = (
    <Upload
      name="file"
      listType="picture-card"
      fileList={fileList}
      maxCount={1}
      accept="image/*"
      onChange={({ fileList: next }) => {
        if (next.length === 0) {
          onChange?.('');
        }
      }}
      beforeUpload={(file) => {
        if (file.size > 5 * 1024 * 1024) {
          message.error('文件大小不能超过 5MB');
          return false;
        }
        uploadApi
          .uploadImage(file)
          .then((response) => {
            onChange?.(response.data.url);
            message.success('上传成功');
          })
          .catch((error) => {
            console.error('Upload failed:', error);
            message.error('上传失败，请重试');
          });
        return false;
      }}
      onRemove={() => {
        onChange?.('');
      }}
    >
      {fileList.length === 0 && (
        <div
          style={{
            width: '100px',
            height: '100px',
            border: '1px dashed #d9d9d9',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Upload>
  );

  return crop ? <ImgCrop>{upload}</ImgCrop> : upload;
};

const UserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recommendedItems, setRecommendedItems] = useState<RecommendedItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [editingItem, setEditingItem] = useState<RecommendedItem | null>(null);
  const [editForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 并行获取数据，但允许个别请求失败
      const [userRes, projectsRes, articlesRes, pluginsRes, recommendationsRes] = await Promise.allSettled([
        userApi.getUserInfo(),
        projectApi.getProjects(),
        articleApi.getArticles(),
        pluginApi.getPlugins(),
        recommendationApi.getRecommendations()
      ]);
      
      // 处理用户信息
      if (userRes.status === 'fulfilled') {
        setUserInfo({
          ...userRes.value.data,
          phone: userRes.value.data.phone || '',
          portfolio: userRes.value.data.portfolio || '',
          wechatQRCode: userRes.value.data.wechatQRCode || ''
        });
      } else {
        console.error('Failed to fetch user info:', userRes.reason);
        message.warning('获取用户信息失败');
      }
      
      // 处理项目数据
      if (projectsRes.status === 'fulfilled') {
        setProjects(projectsRes.value.data);
      } else {
        console.error('Failed to fetch projects:', projectsRes.reason);
        message.warning('获取项目数据失败');
      }
      
      // 处理文章数据
      if (articlesRes.status === 'fulfilled') {
        setArticles(articlesRes.value.data);
      } else {
        console.error('Failed to fetch articles:', articlesRes.reason);
        message.warning('获取文章数据失败');
      }
      
      // 处理插件数据
      if (pluginsRes.status === 'fulfilled') {
        setPlugins(pluginsRes.value.data);
      } else {
        console.error('Failed to fetch plugins:', pluginsRes.reason);
        message.warning('获取插件数据失败');
      }
      
      // 处理推荐项目数据
      if (recommendationsRes.status === 'fulfilled') {
        setRecommendedItems(recommendationsRes.value.data);
      } else {
        console.error('Failed to fetch recommendations:', recommendationsRes.reason);
        message.warning('获取推荐项目数据失败');
        // 出错时使用空数组
        setRecommendedItems([]);
      }
    } catch (err) {
      console.error(err);
      message.error('获取数据失败');
      // 出错时使用空数组
      setRecommendedItems([]);
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


  const handleRemoveFromRecommendations = (id: string) => {
    setRecommendedItems(recommendedItems.filter(item => item.id !== id));
  };

  const handleSaveRecommendationEdit = async (values: any) => {
    if (editingItem) {
      // 编辑现有项目
      const updatedItems = recommendedItems.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...values, type: item.type } // 保留原始类型
          : item
      );
      
      setRecommendedItems(updatedItems);
      setModalVisible(false);
      setEditingItem(null);
      editForm.resetFields();
      message.success('编辑成功');
    } else {
      // 添加新项目
      const { itemId, defaultImage, hoverImage } = values;
      if (!itemId) {
        message.error('请选择项目');
        return;
      }
      
      // 解析itemId格式：type-id
      const [type, id] = itemId.split('-');
      if (!type || !id) {
        message.error('项目选择格式错误');
        return;
      }
      
      // 找到对应的项目、文章或插件
      let title = '';
      if (type === 'project') {
        const project = projects.find(p => p.id.toString() === id);
        if (project) title = project.title;
      } else if (type === 'article') {
        const article = articles.find(a => a.id.toString() === id);
        if (article) title = article.title;
      } else if (type === 'plugin') {
        const plugin = plugins.find(p => p.id.toString() === id);
        if (plugin) title = plugin.title;
      }
      
      if (!title) {
        message.error('未找到选中的项目');
        return;
      }
      
      // 创建新的推荐项目
      const newRecommendedItem: RecommendedItem = {
        id: id,
        type: type as 'project' | 'article' | 'plugin',
        title: title,
        defaultImage: defaultImage || '',
        hoverImage: hoverImage || '',
        enabled: true,
        order: recommendedItems.length + 1
      };
      
      // 检查是否已存在
      if (recommendedItems.some(item => item.id === id && item.type === type)) {
        message.error('该项目已在推荐列表中');
        return;
      }
      
      setRecommendedItems([...recommendedItems, newRecommendedItem]);
      setModalVisible(false);
      editForm.resetFields();
      message.success('添加成功');
    }
  };

  const handleSaveRecommendations = async () => {
    setSaving(true);
    try {
      // 调用API保存推荐项目配置
      await recommendationApi.saveRecommendations(recommendedItems);
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
        <TabPane tab="推荐内容" key="recommendations">
          <Card title="推荐内容设置">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>推荐内容列表</h3>
              <div>
                <Button type="primary" onClick={() => setModalVisible(true)}>
                  新增内容
                </Button>
                <Button style={{ marginLeft: '8px' }} onClick={handleSaveRecommendations} loading={saving}>
                  保存配置
                </Button>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>内容</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>类型</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>路由</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Default图片</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Hover图片</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>启用</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendedItems.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px' }}>{item.title}</td>
                      <td style={{ padding: '12px' }}>{item.type === 'project' ? '项目' : item.type === 'article' ? '文章' : '插件'}</td>
                      <td style={{ padding: '12px' }}>{item.id}</td>
                      <td style={{ padding: '12px' }}>{item.defaultImage ? '✓' : '✗'}</td>
                      <td style={{ padding: '12px' }}>{item.hoverImage ? '✓' : '✗'}</td>
                      <td style={{ padding: '12px' }}>
                        <input 
                          type="checkbox" 
                          checked={item.enabled} 
                          onChange={(e) => {
                            const updatedItems = recommendedItems.map(i => 
                              i.id === item.id ? { ...i, enabled: e.target.checked } : i
                            );
                            setRecommendedItems(updatedItems);
                          }}
                        />
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Button 
                          type="link" 
                          onClick={() => {
                            setEditingItem(item);
                            editForm.setFieldsValue({
                              itemId: `${item.type}-${item.id}`,
                              defaultImage: item.defaultImage,
                              hoverImage: item.hoverImage
                            });
                            setModalVisible(true);
                          }}
                        >
                          编辑
                        </Button>
                        <Button 
                          type="link" 
                          danger
                          onClick={() => handleRemoveFromRecommendations(item.id)}
                        >
                          删除
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabPane>
      </Tabs>
      
      {/* 编辑推荐项目模态框 */}
      <Modal
        title={editingItem ? "编辑推荐项目" : "添加推荐项目"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingItem(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={editForm}
          onFinish={handleSaveRecommendationEdit}
          layout="vertical"
        >
          <Form.Item label="项目" name="itemId" rules={[{ required: true, message: '请选择项目' }]}>
            <Select placeholder="请选择">
              <Option value="">请选择</Option>
              <OptGroup label="项目">
                {projects.map(project => (
                  <Option key={project.id} value={`project-${project.id}`}>{project.title}</Option>
                ))}
              </OptGroup>
              <OptGroup label="文章">
                {articles.map(article => (
                  <Option key={article.id} value={`article-${article.id}`}>{article.title}</Option>
                ))}
              </OptGroup>
              <OptGroup label="插件">
                {plugins.map(plugin => (
                  <Option key={plugin.id} value={`plugin-${plugin.id}`}>{plugin.title}</Option>
                ))}
              </OptGroup>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="defaultImage"
            label="默认图片"
            rules={[{ required: true, message: '请上传默认图片' }]}
          >
            <RecommendationImageUpload />
          </Form.Item>

          <Form.Item
            name="hoverImage"
            label="悬停图片"
            rules={[{ required: true, message: '请上传悬停图片' }]}
          >
            <RecommendationImageUpload />
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right' }}>
            <Button onClick={() => setModalVisible(false)} style={{ marginRight: '8px' }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserSettings;
