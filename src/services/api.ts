import axios from 'axios';
import type { UserInfo, Project, Article, Plugin } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  getUserInfo: () => api.get<UserInfo>('/user/info'),
  updateUserInfo: (data: Partial<UserInfo>) => api.put<UserInfo>('/user/info', data),
};

export const projectApi = {
  getProjects: () => api.get<Project[]>('/projects'),
  getProjectById: (id: string) => api.get<Project>(`/projects/${id}`),
};

export const articleApi = {
  getArticles: () => api.get<Article[]>('/articles'),
  getArticleById: (id: string) => api.get<Article>(`/articles/${id}`),
};

export const pluginApi = {
  getPlugins: () => api.get<Plugin[]>('/plugins'),
  getPluginById: (id: string) => api.get<Plugin>(`/plugins/${id}`),
};

export default api;
