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

export const getArticleDetail = async (
  id: string,
): Promise<ArticleDetail> => {
  if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
    const article = mockArticleDetail[id];
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }
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
  if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
    const plugin = mockPluginDetail[id];
    if (!plugin) {
      throw new Error('Plugin not found');
    }
    return plugin;
  }
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
  if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
    const project = mockProjectDetail[id];
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }
  try {
    const response = await projectApi.getProjectDetail(id);
    // 转换后端数据为前端需要的格式
    const projectData = response.data;
    return {
      id: projectData.id.toString(),
      title: projectData.title,
      summary: projectData.summary,
      background: projectData.content || '',
      designThinking: '',
      images: [],
      tags: projectData.tags || [],
      achievements: [],
      client: '',
      year: '',
      role: '',
      tools: [],
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
