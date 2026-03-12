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
  const response = await articleApi.getArticleById(id);
  return response.data as ArticleDetail;
};

export const getPluginDetail = async (id: string): Promise<PluginDetail> => {
  if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
    const plugin = mockPluginDetail[id];
    if (!plugin) {
      throw new Error('Plugin not found');
    }
    return plugin;
  }
  const response = await pluginApi.getPluginById(id);
  return response.data as PluginDetail;
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
  const response = await projectApi.getProjectDetail(id);
  return response.data;
};

export default api;
