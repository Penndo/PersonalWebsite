import { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi, authStorage } from '@/services/api';
import './AdminLogin.less';

interface LoginFormValues {
  username: string;
  password: string;
}

interface LocationState {
  from?: string;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<LoginFormValues>();

  useEffect(() => {
    if (authStorage.hasFreshToken()) {
      const target = (location.state as LocationState | null)?.from ?? '/admin';
      navigate(target, { replace: true });
    }
  }, [location.state, navigate]);

  const handleSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    try {
      const { data } = await authApi.login(values.username.trim(), values.password);
      authStorage.set(data.token, data.username, data.expiresAt);
      message.success('登录成功');
      const target = (location.state as LocationState | null)?.from ?? '/admin';
      navigate(target, { replace: true });
    } catch (err: unknown) {
      const tip =
        (err as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ??
        (err as { message?: string })?.message ??
        '登录失败，请稍后重试';
      message.error(tip);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__bg" aria-hidden />
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <span className="admin-login__brand-mark">YF</span>
          <span className="admin-login__brand-meta">/ admin console</span>
        </div>
        <h1 className="admin-login__title">登录后台管理</h1>
        <p className="admin-login__subtitle">
          请使用管理员账号登录。如尚未修改默认密码，请在登录后及时修改。
        </p>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          autoComplete="off"
          className="admin-login__form"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              autoFocus
            />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={submitting}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <p className="admin-login__footer">
          登录后可在「用户设置 → 账户安全」中修改密码。
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
