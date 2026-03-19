import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  AppstoreOutlined,
  ProjectOutlined,
  FileTextOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

interface AdminSiderProps {
  collapsed: boolean;
}

const menuItems = [
  {
    key: '/admin/user',
    icon: <UserOutlined />,
    label: '用户设置',
  },
  {
    key: '/admin/tabs',
    icon: <AppstoreOutlined />,
    label: '导航配置',
  },
  {
    key: '/admin/projects',
    icon: <ProjectOutlined />,
    label: '项目管理',
  },
  {
    key: '/admin/articles',
    icon: <FileTextOutlined />,
    label: '文章管理',
  },
  {
    key: '/admin/plugins',
    icon: <ApiOutlined />,
    label: '插件管理',
  },
];

const AdminSider: React.FC<AdminSiderProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
        }}
      >
        <span style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: 18, fontWeight: 600 }}>
          {collapsed ? '管理' : '后台管理'}
        </span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        items={menuItems}
      />
    </Sider>
  );
};

export default AdminSider;
