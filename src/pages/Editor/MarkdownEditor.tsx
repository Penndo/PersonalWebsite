import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Tabs, Button, Upload, message } from 'antd';
import { UploadOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import mermaid from 'mermaid';
import { uploadApi } from '@/services/api';
import imageCompression from 'browser-image-compression';
import type { Components } from 'react-markdown';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
}

/** 块级 ``` 代码在 hast 中位于 pre > code；行内代码仅有 code，用于区分高亮 / Mermaid / 行内样式 */
const BlockCodeContext = createContext(false);

let mermaidInited = false;

function ensureMermaidInit() {
  if (mermaidInited) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'strict',
    fontFamily: 'inherit',
  });
  mermaidInited = true;
}

function MermaidBlock({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureMermaidInit();
    let cancelled = false;
    setError(null);
    (async () => {
      try {
        const id = `mmd-${Math.random().toString(36).slice(2, 11)}`;
        const { svg, bindFunctions } = await mermaid.render(id, chart.trim());
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        bindFunctions?.(containerRef.current);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Mermaid 渲染失败');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <pre className="markdown-mermaid-error" role="alert">
        {error}
      </pre>
    );
  }
  return <div ref={containerRef} className="markdown-mermaid" />;
}

type CodeProps = React.ClassAttributes<HTMLElement> &
  React.HTMLAttributes<HTMLElement> & {
    className?: string;
    children?: React.ReactNode;
  };

function MarkdownCodeElement({ className, children, ...rest }: CodeProps) {
  const inBlock = useContext(BlockCodeContext);
  const text = String(children ?? '').replace(/\n$/, '');
  const match = /language-(\w+)/.exec(className || '');
  const lang = match?.[1]?.toLowerCase();

  if (!inBlock) {
    return (
      <code className={['markdown-inline-code', className].filter(Boolean).join(' ')} {...rest}>
        {children}
      </code>
    );
  }

  if (lang === 'mermaid') {
    return <MermaidBlock chart={text} />;
  }

  if (match && lang) {
    return (
      <div className="markdown-code-block-wrap">
        <div className="markdown-code-block-lang">{lang}</div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={lang}
          PreTag="div"
          className="markdown-syntax-block"
        >
          {text}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <div className="markdown-code-block-wrap markdown-code-block-wrap--plain">
      <pre className="markdown-fenced-plain">
        <code className={className} {...rest}>
          {children}
        </code>
      </pre>
    </div>
  );
}

const markdownComponents: Components = {
  pre: ({ children }) => (
    <BlockCodeContext.Provider value={true}>
      <div className="markdown-pre-root">{children}</div>
    </BlockCodeContext.Provider>
  ),
  code: MarkdownCodeElement as Components['code'],
  a: ({ href, children, className, ...rest }) => {
    const isExternal =
      typeof href === 'string' &&
      (href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//'));
    return (
      <a
        href={href}
        {...rest}
        className={['markdown-preview-link', className].filter(Boolean).join(' ')}
        {...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {children}
      </a>
    );
  },
};

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
        fileType: 'image/jpeg',
      };

      const compressedFile = await imageCompression(file, options);
      const response = await uploadApi.uploadImage(compressedFile);

      const imageMarkdown = `![${file.name}](${response.data.url})`;
      onChange(content + imageMarkdown);
      message.success('图片插入成功');
    } catch (error) {
      console.error('Image upload failed:', error);
      message.error('图片上传失败，请重试');
    } finally {
      setUploading(false);
    }
    return false;
  };

  return (
    <div className="markdown-editor">
      <div className="editor-toolbar">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'edit' | 'preview')}
          items={[
            {
              key: 'edit',
              label: (
                <span>
                  <EditOutlined /> 编辑
                </span>
              ),
            },
            {
              key: 'preview',
              label: (
                <span>
                  <EyeOutlined /> 预览
                </span>
              ),
            },
          ]}
        />

        <div className="toolbar-actions">
          <Upload
            name="file"
            showUploadList={false}
            beforeUpload={handleImageUpload}
            disabled={uploading}
            accept="image/*"
          >
            <Button
              icon={<UploadOutlined />}
              loading={uploading}
              disabled={uploading}
            >
              插入图片
            </Button>
          </Upload>
        </div>
      </div>

      <div className="editor-content">
        {activeTab === 'edit' ? (
          <div className="edit-mode">
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="开始编写...（换行在预览中保留；支持 GFM、```代码、```mermaid、[文字](链接) 等）"
              className="markdown-textarea"
            />
          </div>
        ) : (
          <div className="preview-mode markdown-preview-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={markdownComponents}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
