import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { ProjectDetail, ArticleDetail, PluginDetail } from '@/pages';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/plugin/:id" element={<PluginDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
