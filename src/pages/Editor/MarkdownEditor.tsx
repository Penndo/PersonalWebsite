import { useState, useRef } from 'react';
import { Tabs, Button, Upload, message } from 'antd';
import { UploadOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { uploadApi } from '@/services/api';
import imageCompression from 'browser-image-compression';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

      const imageMarkdown = `
![${file.name}](${response.data.url})
`;
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

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const selected = text.substring(start, end);
      const after = text.substring(end);

      const newText = before + prefix + selected + suffix + after;
      onChange(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + selected.length
        );
      }, 0);
    }
  };

  const toolbarGroups = [
    {
      name: 'text',
      buttons: [
        { label: '粗体', action: () => insertMarkdown('**', '**'), shortcut: 'Ctrl+B' },
        { label: '斜体', action: () => insertMarkdown('*', '*'), shortcut: 'Ctrl+I' },
        { label: '删除线', action: () => insertMarkdown('~~', '~~'), shortcut: 'Ctrl+D' },
      ]
    },
    {
      name: 'headings',
      buttons: [
        { label: 'H1', action: () => insertMarkdown('# ', ''), shortcut: 'Ctrl+1' },
        { label: 'H2', action: () => insertMarkdown('## ', ''), shortcut: 'Ctrl+2' },
        { label: 'H3', action: () => insertMarkdown('### ', ''), shortcut: 'Ctrl+3' },
      ]
    },
    {
      name: 'code',
      buttons: [
        { label: '代码', action: () => insertMarkdown('`', '`'), shortcut: 'Ctrl+`' },
        { label: '代码块', action: () => insertMarkdown('```\\n', '\\n```'), shortcut: 'Ctrl+Shift+C' },
      ]
    },
    {
      name: 'links',
      buttons: [
        { label: '链接', action: () => insertMarkdown('[', '](url)'), shortcut: 'Ctrl+L' },
        { label: '图片', action: () => insertMarkdown('![alt](', ')'), shortcut: 'Ctrl+Shift+I' },
      ]
    },
    {
      name: 'lists',
      buttons: [
        { label: '无序列表', action: () => insertMarkdown('- ', ''), shortcut: 'Ctrl+U' },
        { label: '有序列表', action: () => insertMarkdown('1. ', ''), shortcut: 'Ctrl+O' },
        { label: '任务列表', action: () => insertMarkdown('- [ ] ', ''), shortcut: 'Ctrl+T' },
      ]
    },
    {
      name: 'other',
      buttons: [
        { label: '引用', action: () => insertMarkdown('> ', ''), shortcut: 'Ctrl+Q' },
        { label: '分割线', action: () => insertMarkdown('\\n---\\n', ''), shortcut: 'Ctrl+R' },
        { label: '表格', action: () => insertMarkdown('| 标题1 | 标题2 |\\n| --- | --- |\\n| 内容1 | 内容2 |\\n', ''), shortcut: 'Ctrl+Shift+T' },
      ]
    },
  ];

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
            <div className="formatting-toolbar">
              {toolbarGroups.map((group, groupIndex) => (
                <div key={group.name} className="toolbar-group">
                  {group.buttons.map((button, buttonIndex) => (
                    <Button
                      key={`${groupIndex}-${buttonIndex}`}
                      type="text"
                      onClick={button.action}
                      title={button.shortcut}
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="开始编写你的内容...（支持Markdown语法）"
              className="markdown-textarea"
            />
          </div>
        ) : (
          <div className="preview-mode">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <SyntaxHighlighter
                      {...props}
                      children={String(children).replace(/\n$/, '')}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                    />
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  );
                },
              }}
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