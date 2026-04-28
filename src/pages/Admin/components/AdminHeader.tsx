import { Layout, Button, Dropdown, Space, theme, message, Breadcrumb } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi, authStorage } from '@/services/api';

const { Header } = Layout;

interface AdminHeaderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onCollapse }) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const username = authStorage.getUsername() ?? '管理员';

  const breadcrumbLabel = (() => {
    const pathname = location.pathname;
    if (pathname === '/admin/user') return ['后台管理', '用户设置'];
    if (pathname === '/admin/tabs') return ['后台管理', '导航配置'];
    if (pathname === '/admin/projects') return ['后台管理', '项目管理'];
    if (pathname === '/admin/articles') return ['后台管理', '文章管理'];
    if (pathname === '/admin/plugins') return ['后台管理', '插件管理'];
    if (pathname.startsWith('/admin/editor/project')) return ['后台管理', '项目管理', '编辑项目'];
    if (pathname.startsWith('/admin/editor/article')) return ['后台管理', '文章管理', '编辑文章'];
    if (pathname.startsWith('/admin/editor/plugin')) return ['后台管理', '插件管理', '编辑插件'];
    return ['后台管理'];
  })();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // 服务端清理失败不阻塞前端登出
    }
    authStorage.clear();
    message.success('已退出登录');
    navigate('/admin/login', { replace: true });
  };

  return (
    <Header
      style={{
        background: token.colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      <Space size={12} style={{ minWidth: 0, flex: 1 }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
          aria-label={collapsed ? '展开侧栏' : '收起侧栏'}
        />
        <Breadcrumb
          items={breadcrumbLabel.map((label) => ({ title: label }))}
          style={{
            minWidth: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        />
      </Space>
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: '退出登录',
              onClick: () => {
                void handleLogout();
              },
            },
          ],
        }}
      >
        <Button type="text">
          <Space size={6}>
            <UserOutlined />
            <span>{username}</span>
            <DownOutlined style={{ fontSize: 10, opacity: 0.6 }} />
          </Space>
        </Button>
      </Dropdown>
    </Header>
  );
};

export default AdminHeader;
