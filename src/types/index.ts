export interface UserInfo {
  name: string;
  profession: string;
  age: number;
  hobbies: string[];
  avatar: string;
  introduction: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  cover: string;
  link?: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  cover: string;
  date: string;
  link?: string;
}

export interface Plugin {
  id: string;
  title: string;
  description: string;
  cover: string;
  link?: string;
}

export type TabType = 'works' | 'articles' | 'plugins';
