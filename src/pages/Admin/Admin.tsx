import { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminSider from './components/AdminSider';
import AdminHeader from './components/AdminHeader';
import './Admin.less';

const { Content } = Layout;

const Admin: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout className="admin-layout">
      <AdminSider collapsed={collapsed} />
      <Layout>
        <AdminHeader collapsed={collapsed} onCollapse={setCollapsed} />
        <Content className="admin-content">
          <div className="admin-content-inner">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
