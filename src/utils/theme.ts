import { useState, useEffect } from 'react';

// 主题类型
export type ThemeMode = 'light' | 'dark';

// 监听系统主题变化的工具函数
export const useSystemTheme = (): ThemeMode => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // 初始化时检查系统主题
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 监听函数
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    // 添加监听器
    mediaQuery.addEventListener('change', handleChange);

    // 清理监听器
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return theme;
};

// 主题配置
export const getThemeConfig = (mode: ThemeMode) => {
  return {
    token: {
      colorPrimary: mode === 'dark' ? '#fbbf24' : '#f59e0b',
      colorBgContainer: mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
      colorText: mode === 'dark' ? '#f9fafb' : '#111827',
      colorTextSecondary: mode === 'dark' ? '#e5e7eb' : '#4b5563',
      colorBorder: mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : '#e5e7eb',
    },
    algorithm: mode === 'dark' ? undefined : undefined, // antd 6.x 默认支持亮色模式
  };
};
