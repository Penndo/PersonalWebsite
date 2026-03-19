import { Layout, Button, Avatar, Badge, Tooltip, Space, Typography, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

interface AdminHeaderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onCollapse }) => {
  const { token } = theme.useToken();

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
      />
      <Space size="middle">
        <Badge dot={true}>
          <Tooltip title="消息通知">
            <Button type="text" icon={<UserOutlined />} />
          </Tooltip>
        </Badge>
        <Avatar size="small" icon={<UserOutlined />} />
        <Text>管理员</Text>
        <Tooltip title="退出登录">
          <Button type="text" icon={<LogoutOutlined />} />
        </Tooltip>
      </Space>
    </Header>
  );
};

export default AdminHeader;
