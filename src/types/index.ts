export interface UserInfo {
  name: string;
  profession: string;
  age: number;
  hobbies: string[];
  avatar: string;
  introduction: string;
  phone: string;
  portfolio?: string;
  wechatQRCode?: string;
}

export interface Project {
  id: string;
  title: string;
  routeId: string;
  summary: string;
  content?: string;
  coverUrl?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  cover?: string;
  link?: string;
}

export interface ProjectDetail {
  id: string;
  title: string;
  summary: string;
  background: string;
  designThinking: string;
  images: string[];
  tags: string[];
  achievements: string[];
  client: string;
  year: string;
  role: string;
  tools: string[];
  link?: string;
  content?: string;
}

export interface Article {
  id: string;
  title: string;
  routeId: string;
  summary: string;
  content?: string;
  coverUrl?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  cover?: string;
  date?: string;
  link?: string;
}

export interface ArticleDetail {
  id: string;
  title: string;
  description: string;
  cover: string;
  date: string;
  link?: string;
  readingTime: number;
  views: number;
  tags: string[];
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
}

export interface Plugin {
  id: string;
  title: string;
  routeId: string;
  summary: string;
  content?: string;
  coverUrl?: string;
  repositoryUrl?: string;
  downloadUrl?: string;
  version?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  cover?: string;
  link?: string;
}

export interface PluginDetail {
  id: string;
  title: string;
  description: string;
  cover: string;
  link?: string;
  version: string;
  downloads: number;
  rating: number;
  tags: string[];
  features: string[];
  screenshots: string[];
  author: {
    name: string;
    avatar: string;
  };
}

export type TabType = string;

export interface RecommendedItem {
  id: string;
  type: 'project' | 'article' | 'plugin';
  title: string;
  defaultImage: string;
  hoverImage: string;
  enabled: boolean;
  order: number;
}

export interface HomepageConfig {
  logo?: string;
  recommendedItems: RecommendedItem[];
  userInfo: UserInfo;
}
