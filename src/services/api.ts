import axios from 'axios';
import type { UserInfo, Project, ProjectDetail, Article, Plugin } from '@/types';
import { mockProjectDetail } from './mock';

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
  getProjectDetail: (id: string) => api.get<ProjectDetail>(`/projects/${id}/detail`),
};

export const articleApi = {
  getArticles: () => api.get<Article[]>('/articles'),
  getArticleById: (id: string) => api.get<Article>(`/articles/${id}`),
};

export const pluginApi = {
  getPlugins: () => api.get<Plugin[]>('/plugins'),
  getPluginById: (id: string) => api.get<Plugin>(`/plugins/${id}`),
};

export const getProjectDetail = async (id: string): Promise<ProjectDetail> => {
  if (import.meta.env.DEV || !import.meta.env.VITE_API_BASE_URL) {
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
