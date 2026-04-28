import { useState } from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminSider from './components/AdminSider';
import AdminHeader from './components/AdminHeader';

const { Content } = Layout;

const Admin: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { token } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSider collapsed={collapsed} />
      <Layout>
        <AdminHeader collapsed={collapsed} onCollapse={setCollapsed} />
        <Content style={{ padding: '24px 24px', background: token.colorBgLayout }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
