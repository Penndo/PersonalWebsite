import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import { ProjectDetail, ArticleDetail, PluginDetail, Admin } from '@/pages';
import Editor from '@/pages/Editor/Editor';
import UserSettings from '@/pages/Admin/pages/UserSettings';
import TabsSettings from '@/pages/Admin/pages/TabsSettings';
import ProjectsManage from '@/pages/Admin/pages/ProjectsManage';
import ArticlesManage from '@/pages/Admin/pages/ArticlesManage';
import PluginsManage from '@/pages/Admin/pages/PluginsManage';
import AdminLogin from '@/pages/Admin/AdminLogin';
import RequireAuth from '@/pages/Admin/RequireAuth';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/plugin/:id" element={<PluginDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <Admin />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/admin/user" replace />} />
          <Route path="user" element={<UserSettings />} />
          <Route path="tabs" element={<TabsSettings />} />
          <Route path="projects" element={<ProjectsManage />} />
          <Route path="articles" element={<ArticlesManage />} />
          <Route path="plugins" element={<PluginsManage />} />
          <Route path="editor/:type" element={<Editor type="project" />} />
          <Route path="editor/:type/:id" element={<Editor type="project" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
