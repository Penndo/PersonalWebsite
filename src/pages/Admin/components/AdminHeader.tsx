import { Layout, Button, Dropdown, Space, theme, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi, authStorage } from '@/services/api';

const { Header } = Layout;

interface AdminHeaderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onCollapse }) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const username = authStorage.getUsername() ?? '管理员';

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
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => onCollapse(!collapsed)}
        aria-label={collapsed ? '展开侧栏' : '收起侧栏'}
      />
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
