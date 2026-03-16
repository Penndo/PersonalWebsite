import { useState } from 'react';
import { Layout, ConfigProvider } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminSider from './components/AdminSider';
import AdminHeader from './components/AdminHeader';
import { useSystemTheme, getThemeConfig } from '@/utils/theme';
import './Admin.less';

const { Content } = Layout;

const Admin: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const themeMode = useSystemTheme();
  const themeConfig = getThemeConfig(themeMode);

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout className={`admin-layout ${themeMode}`}>
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
    </ConfigProvider>
  );
};

export default Admin;
