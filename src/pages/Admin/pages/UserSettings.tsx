import { useEffect, useState, useRef } from 'react';
import { Card, Form, Input, InputNumber, Button, Spin, message, Tabs, Upload, Modal, Select, Popconfirm} from 'antd';
const { Option, OptGroup } = Select;
import { UploadOutlined } from '@ant-design/icons';
import { userApi, projectApi, articleApi, pluginApi, uploadApi, recommendationApi } from '@/services/api';
import type { UserInfo, Project, Article, Plugin, RecommendedItem } from '@/types';
import './UserSettings.less';
import DeferredImageUpload, { clearAllDeferredBlobs } from '@/components/DeferredImageUpload/DeferredImageUpload';
import { collectUploadPathsFromRecommendations, collectUploadPathsFromUser } from '@/utils/uploads';

const { TabPane } = Tabs;

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
  /** blob 预览 URL → File，仅在「保存配置」时调用 uploadApi */
  const recommendationPendingFilesRef = useRef<Map<string, File>>(new Map());
  /** 头像 / 微信二维码：仅在「保存基础信息」时上传 */
  const userProfilePendingFilesRef = useRef<Map<string, File>>(new Map());
  /** 上次已成功持久化到服务端的用户信息，用于对比并删除被替换的 /uploads/ 文件 */
  const lastPersistedUserRef = useRef<UserInfo | null>(null);
  /** 上次成功从服务端拉取或保存后的推荐列表；与本次保存结果对比才能发现「已删除行」上的图片等孤儿资源 */
  const lastPersistedRecommendationsRef = useRef<RecommendedItem[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      clearAllDeferredBlobs(recommendationPendingFilesRef);
      clearAllDeferredBlobs(userProfilePendingFilesRef);
    };
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
        const loaded: UserInfo = {
          ...userRes.value.data,
          phone: userRes.value.data.phone || '',
          portfolio: userRes.value.data.portfolio || '',
          wechatQRCode: userRes.value.data.wechatQRCode || '',
        };
        setUserInfo(loaded);
        lastPersistedUserRef.current = loaded;
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
        const recData = recommendationsRes.value.data;
        setRecommendedItems(recData);
        lastPersistedRecommendationsRef.current = JSON.parse(
          JSON.stringify(recData),
        ) as RecommendedItem[];
      } else {
        console.error('Failed to fetch recommendations:', recommendationsRes.reason);
        message.warning('获取推荐项目数据失败');
        // 出错时使用空数组
        setRecommendedItems([]);
        lastPersistedRecommendationsRef.current = [];
      }
    } catch (err) {
      console.error(err);
      message.error('获取数据失败');
      // 出错时使用空数组
      setRecommendedItems([]);
      lastPersistedRecommendationsRef.current = [];
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

  /** 手动改 URL 时若覆盖本地 blob 预览，则释放 blob，避免泄漏 */
  const handleUserImageFieldInput = (field: 'avatar' | 'wechatQRCode', next: string) => {
    if (!userInfo) return;
    const prev = userInfo[field];
    if (typeof prev === 'string' && prev.startsWith('blob:') && prev !== next) {
      userProfilePendingFilesRef.current.delete(prev);
      URL.revokeObjectURL(prev);
    }
    handleUserChange(field, next);
  };

  const handleFileUpload = async (file: File, field: string) => {
    try {
      setUploading(true);
      const response = await uploadApi.uploadImage(file);
      const url = response.data?.url;
      if (!url) {
        message.error('上传响应无效');
        return false;
      }
      setUserInfo((prev) =>
        prev ? { ...prev, [field]: url } : prev,
      );
      message.success('上传成功');
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
    const prevPersisted = lastPersistedUserRef.current;
    try {
      const payload: UserInfo = JSON.parse(JSON.stringify(userInfo)) as UserInfo;
      for (const field of ['avatar', 'wechatQRCode'] as const) {
        const u = payload[field];
        if (typeof u !== 'string' || !u.startsWith('blob:')) continue;
        const file = userProfilePendingFilesRef.current.get(u);
        if (!file) {
          message.error('部分图片仅在本地预览，请重新选择后再保存');
          return;
        }
        const { data } = await uploadApi.uploadImage(file);
        userProfilePendingFilesRef.current.delete(u);
        URL.revokeObjectURL(u);
        payload[field] = data.url;
      }

      const res = await userApi.updateUserInfo(payload);

      const beforePaths = collectUploadPathsFromUser(prevPersisted);
      const afterPaths = collectUploadPathsFromUser(res.data);
      const refPathsFromRecommendations = collectUploadPathsFromRecommendations(recommendedItems);
      for (const p of beforePaths) {
        if (afterPaths.has(p)) continue;
        if (refPathsFromRecommendations.has(p)) continue;
        await uploadApi.deleteUpload(p).catch(() => {});
      }

      setUserInfo(res.data);
      lastPersistedUserRef.current = res.data;
      message.success('用户信息已保存');
    } catch (err) {
      console.error(err);
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };


  const handleRemoveFromRecommendations = (id: string) => {
    const row = recommendedItems.find((item) => item.id === id);
    if (row) {
      if (row.defaultImage?.startsWith('blob:')) {
        recommendationPendingFilesRef.current.delete(row.defaultImage);
        URL.revokeObjectURL(row.defaultImage);
      }
      if (row.hoverImage?.startsWith('blob:')) {
        recommendationPendingFilesRef.current.delete(row.hoverImage);
        URL.revokeObjectURL(row.hoverImage);
      }
    }
    setRecommendedItems(recommendedItems.filter((item) => item.id !== id));
  };

  /** 弹窗内已写入 recommendedItems：只关弹窗。勿 revoke 表单里的 blob，否则 Map 被清空后「保存配置」无法上传 */
  const hideRecommendationModal = () => {
    setModalVisible(false);
    setEditingItem(null);
    editForm.resetFields();
  };

  /** 取消 / 点遮罩关闭：只 revoke 仍未写入 recommendedItems 的 blob（避免把列表里正在用的预览 revoke 掉，第二次编辑会 ERR_FILE_NOT_FOUND） */
  const discardRecommendationModal = () => {
    const { defaultImage, hoverImage } = editForm.getFieldsValue(['defaultImage', 'hoverImage']);

    const revokeIfOrphanBlob = (url: unknown) => {
      if (typeof url !== 'string' || !url.startsWith('blob:')) return;
      const stillReferenced = recommendedItems.some(
        (it) => it.defaultImage === url || it.hoverImage === url
      );
      if (stillReferenced) return;
      recommendationPendingFilesRef.current.delete(url);
      URL.revokeObjectURL(url);
    };

    revokeIfOrphanBlob(defaultImage);
    revokeIfOrphanBlob(hoverImage);
    hideRecommendationModal();
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
      hideRecommendationModal();
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
      hideRecommendationModal();
      message.success('添加成功');
    }
  };

  const handleSaveRecommendations = async () => {
    setSaving(true);
    try {
      const nextItems: RecommendedItem[] = JSON.parse(JSON.stringify(recommendedItems)) as RecommendedItem[];
      const blobUrlsToClear: string[] = [];

      for (const item of nextItems) {
        for (const key of ['defaultImage', 'hoverImage'] as const) {
          const u = item[key];
          if (typeof u !== 'string' || !u.startsWith('blob:')) continue;
          const file = recommendationPendingFilesRef.current.get(u);
          if (!file) {
            message.error('部分图片仅在本地预览，请重新选择后再保存');
            return;
          }
          const response = await uploadApi.uploadImage(file);
          item[key] = response.data.url;
          blobUrlsToClear.push(u);
        }
      }

      const res = await recommendationApi.saveRecommendations(nextItems);
      for (const blob of blobUrlsToClear) {
        recommendationPendingFilesRef.current.delete(blob);
        URL.revokeObjectURL(blob);
      }
      // 与「上次服务端状态」对比，才能覆盖：列表里已删掉、但尚未保存的行（其 /uploads/ 图否则不会被清理）
      const beforeRec = collectUploadPathsFromRecommendations(lastPersistedRecommendationsRef.current);
      const afterRec = collectUploadPathsFromRecommendations(res.data);
      const refPathsFromUser = collectUploadPathsFromUser(lastPersistedUserRef.current);
      for (const u of beforeRec) {
        if (afterRec.has(u)) continue;
        if (refPathsFromUser.has(u)) continue;
        await uploadApi.deleteUpload(u).catch(() => {});
      }
      lastPersistedRecommendationsRef.current = JSON.parse(JSON.stringify(res.data)) as RecommendedItem[];
      setRecommendedItems(res.data);
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
      <Card styles={{ body: { padding: 0 } }}>
        <Tabs
          className="user-settings-tabs"
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarStyle={{ margin: 0, borderBottom: 'none' }}
          renderTabBar={(props, DefaultTabBar) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              <DefaultTabBar {...props} />
            </div>
          )}
        >
          <TabPane tab="基础信息配置" key="basic">
            <div style={{ padding: 24 }}>
            <Card styles={{ body: { padding: 0}}}
              style={{ border: 'none' }}
            >
              {userInfo && (
                <Form layout="vertical" className="user-settings-form">
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
                    <DeferredImageUpload
                      value={userInfo.avatar}
                      onChange={(url) => handleUserChange('avatar', url)}
                      pendingFilesRef={userProfilePendingFilesRef}
                      commitHint="已选择，点击「保存基础信息」后上传服务器"
                    />
                    <Input
                      style={{ marginTop: 8 }}
                      value={userInfo.avatar}
                      onChange={(e) => handleUserImageFieldInput('avatar', e.target.value)}
                      placeholder="或直接填写图片 URL"
                    />
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
                    <DeferredImageUpload
                      value={userInfo.wechatQRCode || ''}
                      onChange={(url) => handleUserChange('wechatQRCode', url)}
                      pendingFilesRef={userProfilePendingFilesRef}
                      commitHint="已选择，点击「保存基础信息」后上传服务器"
                    />
                    <Input
                      style={{ marginTop: 8 }}
                      value={userInfo.wechatQRCode || ''}
                      onChange={(e) => handleUserImageFieldInput('wechatQRCode', e.target.value)}
                      placeholder="或直接填写图片 URL"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={handleSaveUser} loading={saving}>
                      保存基础信息
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Card>
            </div>
          </TabPane>
          <TabPane tab="推荐内容" key="recommendations">
            <div style={{ padding: 24 }}>
              <div
                style={{
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    setEditingItem(null);
                    editForm.resetFields();
                    setModalVisible(true);
                  }}
                >
                  新增内容
                </Button>
                <Button onClick={handleSaveRecommendations} loading={saving}>
                  保存配置
                </Button>
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
                          <Popconfirm
                            title="是否确认删除？"
                            onConfirm={() => handleRemoveFromRecommendations(item.id)}
                            okText="确认"
                            cancelText="取消"
                          >
                            <Button type="link" danger>
                              删除
                            </Button>
                          </Popconfirm>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 编辑推荐项目模态框 */}
      <Modal
        title={editingItem ? "编辑推荐项目" : "添加推荐项目"}
        open={modalVisible}
        onCancel={discardRecommendationModal}
        footer={null}
      >
        <Form
          form={editForm}
          onFinish={handleSaveRecommendationEdit}
          layout="vertical"
        >
          <Form.Item label="项目" name="itemId" rules={[{ required: true, message: '请选择项目' }]}>
            <Select placeholder="请选择">
              <OptGroup label="项目">
                {projects.map((project) => (
                  <Option key={`project-${project.id}`} value={`project-${project.id}`}>
                    {project.title}
                  </Option>
                ))}
              </OptGroup>
              <OptGroup label="文章">
                {articles.map((article) => (
                  <Option key={`article-${article.id}`} value={`article-${article.id}`}>
                    {article.title}
                  </Option>
                ))}
              </OptGroup>
              <OptGroup label="插件">
                {plugins.map((plugin) => (
                  <Option key={`plugin-${plugin.id}`} value={`plugin-${plugin.id}`}>
                    {plugin.title}
                  </Option>
                ))}
              </OptGroup>
            </Select>
          </Form.Item>

          <p style={{ margin: '0 0 12px', color: 'rgba(0,0,0,0.45)', fontSize: 12 }}>
            默认 / 悬停图先缓存在浏览器（blob 预览），确认列表无误后点击页面上的「保存配置」再统一上传服务器。
          </p>
          
          <Form.Item
            name="defaultImage"
            label="默认图片"
            rules={[{ required: true, message: '请选择默认图片' }]}
          >
            <DeferredImageUpload
              pendingFilesRef={recommendationPendingFilesRef}
              commitHint="已选择，点击「保存配置」后上传服务器"
            />
          </Form.Item>

          <Form.Item
            name="hoverImage"
            label="悬停图片"
            rules={[{ required: true, message: '请选择悬停图片' }]}
          >
            <DeferredImageUpload
              pendingFilesRef={recommendationPendingFilesRef}
              commitHint="已选择，点击「保存配置」后上传服务器"
            />
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right' }}>
            <Button onClick={discardRecommendationModal} style={{ marginRight: '8px' }}>
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
