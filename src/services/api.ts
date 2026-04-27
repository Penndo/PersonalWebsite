import axios from 'axios';
import type {
  UserInfo,
  Project,
  ProjectDetail,
  Article,
  ArticleDetail,
  Plugin,
  PluginDetail,
  TabType,
  RecommendedItem,
} from '@/types';
import {
  mockProjectDetail,
  mockArticleDetail,
  mockPluginDetail,
} from './mock';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------- Admin Auth (token in localStorage, Bearer header) ----------

const AUTH_TOKEN_KEY = 'admin_auth_token';
const AUTH_USERNAME_KEY = 'admin_auth_username';
const AUTH_EXPIRES_KEY = 'admin_auth_expires_at';

export const authStorage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },
  getUsername(): string | null {
    try {
      return localStorage.getItem(AUTH_USERNAME_KEY);
    } catch {
      return null;
    }
  },
  getExpiresAt(): number | null {
    try {
      const raw = localStorage.getItem(AUTH_EXPIRES_KEY);
      if (!raw) return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  },
  set(token: string, username: string, expiresAt?: number): void {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USERNAME_KEY, username);
      if (typeof expiresAt === 'number') {
        localStorage.setItem(AUTH_EXPIRES_KEY, String(expiresAt));
      } else {
        localStorage.removeItem(AUTH_EXPIRES_KEY);
      }
    } catch {
      /* ignore */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USERNAME_KEY);
      localStorage.removeItem(AUTH_EXPIRES_KEY);
    } catch {
      /* ignore */
    }
  },
  hasFreshToken(): boolean {
    const token = authStorage.getToken();
    if (!token) return false;
    const expiresAt = authStorage.getExpiresAt();
    if (typeof expiresAt === 'number' && expiresAt <= Date.now()) {
      return false;
    }
    return true;
  },
};

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

let onUnauthorized: (() => void) | null = null;

/** 由前端路由层注册：401 时清空登录态并跳回登录页 */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      authStorage.clear();
      if (onUnauthorized) onUnauthorized();
    }
    return Promise.reject(error);
  },
);

interface LoginResponse {
  token: string;
  username: string;
  expiresAt: number;
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { username, password }),
  logout: () => api.post<{ ok: boolean }>('/auth/logout'),
  me: () => api.get<{ username: string }>('/auth/me'),
  changePassword: (oldPassword: string, newPassword: string) =>
    api.post<{ ok: boolean }>('/auth/change-password', {
      oldPassword,
      newPassword,
    }),
};

export const userApi = {
  getUserInfo: () => api.get<UserInfo>('/user/profile'),
  updateUserInfo: (data: Partial<UserInfo>) =>
    api.put<UserInfo>('/user/profile', data),
};

export interface TabConfigDto {
  key: TabType;
  label: string;
  order: number;
  enabled: boolean;
}

export const tabsApi = {
  getTabs: () => api.get<TabConfigDto[]>('/tabs'),
  updateTabs: (data: TabConfigDto[]) => api.put<TabConfigDto[]>('/tabs', data),
};

export const projectApi = {
  getProjects: () => api.get<Project[]>('/projects'),
  getProjectById: (id: string) => api.get<Project>(`/projects/${id}`),
  getProjectDetail: (id: string) =>
    api.get<ProjectDetail>(`/projects/${id}`),
  createProject: (data: Partial<Project>) => api.post<Project>('/projects', data),
  updateProject: (id: string, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/projects/${id}`),
};

export const articleApi = {
  getArticles: () => api.get<Article[]>('/articles'),
  getArticleById: (id: string) => api.get<Article>(`/articles/${id}`),
  createArticle: (data: Partial<Article>) => api.post<Article>('/articles', data),
  updateArticle: (id: string, data: Partial<Article>) => api.put<Article>(`/articles/${id}`, data),
  deleteArticle: (id: string) => api.delete(`/articles/${id}`),
};

export const pluginApi = {
  getPlugins: () => api.get<Plugin[]>('/plugins'),
  getPluginById: (id: string) => api.get<Plugin>(`/plugins/${id}`),
  createPlugin: (data: Partial<Plugin>) => api.post<Plugin>('/plugins', data),
  updatePlugin: (id: string, data: Partial<Plugin>) => api.put<Plugin>(`/plugins/${id}`, data),
  deletePlugin: (id: string) => api.delete(`/plugins/${id}`),
};

export const recommendationApi = {
  getRecommendations: () => api.get<Array<{
    id: number;
    itemId: string;
    itemType: 'project' | 'article' | 'plugin';
    title: string;
    defaultImage: string;
    hoverImage: string;
    enabled: boolean;
    order: number;
  }>>('/recommendations').then(res => {
    // 转换数据结构为前端期望的格式
    return {
      ...res,
      data: res.data.map(item => ({
        id: item.itemId,
        type: item.itemType,
        title: item.title,
        defaultImage: item.defaultImage,
        hoverImage: item.hoverImage,
        enabled: item.enabled,
        order: item.order
      }))
    };
  }),
  saveRecommendations: (data: RecommendedItem[]) => {
    // 转换数据结构为后端期望的格式
    const transformedData = data.map(item => ({
      itemId: item.id,
      itemType: item.type,
      title: item.title,
      defaultImage: item.defaultImage,
      hoverImage: item.hoverImage,
      enabled: item.enabled,
      order: item.order
    }));
    return api.post<Array<{
      id: number;
      itemId: string;
      itemType: 'project' | 'article' | 'plugin';
      title: string;
      defaultImage: string;
      hoverImage: string;
      enabled: boolean;
      order: number;
    }>>('/recommendations/batch', transformedData).then(res => {
      // 转换数据结构为前端期望的格式
      return {
        ...res,
        data: res.data.map(item => ({
          id: item.itemId,
          type: item.itemType,
          title: item.title,
          defaultImage: item.defaultImage,
          hoverImage: item.hoverImage,
          enabled: item.enabled,
          order: item.order
        }))
      };
    });
  },
};

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ url: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  /** 删除本站 public/uploads 下的文件（相对路径或完整 URL） */
  deleteUpload: (url: string) => api.post<{ ok: boolean }>('/upload/remove', { url }),
};

export const getArticleDetail = async (
  id: string,
): Promise<ArticleDetail> => {
  try {
    const response = await articleApi.getArticleById(id);
    // 转换后端数据为前端需要的格式
    const articleData = response.data;
    return {
      id: articleData.id.toString(),
      title: articleData.title,
      description: articleData.summary,
      cover: articleData.coverUrl || '',
      date: articleData.createdAt ? new Date(articleData.createdAt).toISOString().split('T')[0] : '',
      tags: articleData.tags || [],
      content: articleData.content || '',
      readingTime: 5, // 默认值
      views: 0, // 默认值
      author: {
        name: 'Yeatfish',
        avatar: '',
        bio: 'UI/UX设计师',
      },
    };
  } catch (error) {
    console.error('Failed to fetch article detail:', error);
    // 如果真实 API 失败，尝试使用 mock 数据
    const article = mockArticleDetail[id];
    if (article) {
      return article;
    }
    throw new Error('Article not found');
  }
};

export const getPluginDetail = async (id: string): Promise<PluginDetail> => {
  try {
    const response = await pluginApi.getPluginById(id);
    // 转换后端数据为前端需要的格式
    const pluginData = response.data;
    return {
      id: pluginData.id.toString(),
      title: pluginData.title,
      description: pluginData.summary,
      cover: pluginData.coverUrl || '',
      version: pluginData.version || '1.0.0',
      downloads: 0, // 默认值
      rating: 5, // 默认值
      tags: pluginData.tags || [],
      features: [], // 默认值
      screenshots: [], // 默认值
      author: {
        name: 'Yeatfish',
        avatar: '',
      },
    };
  } catch (error) {
    console.error('Failed to fetch plugin detail:', error);
    // 如果真实 API 失败，尝试使用 mock 数据
    const plugin = mockPluginDetail[id];
    if (plugin) {
      return plugin;
    }
    throw new Error('Plugin not found');
  }
};

export const getProjectDetail = async (
  id: string,
): Promise<ProjectDetail> => {
  try {
    const response = await projectApi.getProjectById(id);
    // 转换后端数据为前端需要的格式
    const projectData = response.data;
    return {
      id: projectData.id.toString(),
      title: projectData.title,
      summary: projectData.summary,
      background: projectData.content || '',
      designThinking: '',
      images: projectData.coverUrl ? [projectData.coverUrl] : [],
      tags: projectData.tags || [],
      achievements: [],
      client: '',
      year: '',
      role: '',
      tools: [],
      content: projectData.content || '',
    };
  } catch (error) {
    console.error('Failed to fetch project detail:', error);
    // 如果真实 API 失败，尝试使用 mock 数据
    const project = mockProjectDetail[id];
    if (project) {
      return project;
    }
    throw new Error('Project not found');
  }
};

export default api;
