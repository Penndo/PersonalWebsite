import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authStorage, setUnauthorizedHandler } from '@/services/api';

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * 保护后台管理路由：
 * - 无 token / token 已过期 → 重定向到 /admin/login，并把当前路径透传到 state.from
 * - axios 拦截器在收到 401 时也会触发跳转（setUnauthorizedHandler）
 */
const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const authed = authStorage.hasFreshToken();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      navigate('/admin/login', {
        replace: true,
        state: { from: location.pathname + location.search },
      });
    });
    return () => setUnauthorizedHandler(null);
  }, [navigate, location.pathname, location.search]);

  if (!authed) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
