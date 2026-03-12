import { Layout, Button, Avatar, Badge, Tooltip, Space, Typography } from 'antd';
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
  return (
    <Header className="admin-header">
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => onCollapse(!collapsed)}
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
  );
};

export default AdminHeader;
