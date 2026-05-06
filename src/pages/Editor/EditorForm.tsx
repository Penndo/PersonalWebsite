import { useEffect, useRef, useState } from 'react';
import { Input, Button, Tag, Space, message, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { uploadApi } from '@/services/api';
import imageCompression from 'browser-image-compression';
import DeferredImageUpload, {
  clearAllDeferredBlobs,
} from '@/components/DeferredImageUpload/DeferredImageUpload';
import './Editor.less';

interface EditorFormProps {
  formData: {
    title: string;
    routeId: string;
    summary: string;
    coverUrl: string;
    tags: string[];
    content: string;
  };
  setFormData: (data: any) => void;
  type: 'project' | 'article' | 'plugin';
  onSave: (data: EditorFormProps['formData']) => void;
  onCancel: () => void;
  saving: boolean;
}

interface FormLabelProps {
  title: string;
  require?: boolean;
  charCount?: number;
  charCountMax?: number;
  tips?: boolean | string;
}

const FormLabel: React.FC<FormLabelProps> = ({
  title,
  require = false,
  charCount,
  charCountMax,
  tips,
}) => (
  <label className="form-label">
    <span>{title}</span>
    {require && <span className="required">*</span>}
    {typeof tips === 'string' && tips.trim().length > 0 && (
      <Tooltip title={tips}>
        <InfoCircleOutlined className='form-label-tips' />
      </Tooltip>
    )}
    {charCount !== undefined && (
      <span className="char-count">
        {charCount}
        {charCountMax !== undefined ? `/${charCountMax}` : ''}
      </span>
    )}
  </label>
);

const EditorForm: React.FC<EditorFormProps> = ({
  formData,
  setFormData,
  onSave,
  onCancel,
  saving,
}) => {
  const [uploading, setUploading] = useState(false);
  const coverPendingFilesRef = useRef<Map<string, File>>(new Map());

  useEffect(() => {
    return () => {
      clearAllDeferredBlobs(coverPendingFilesRef);
    };
  }, []);

  /** 手动改 URL 时若覆盖本地 blob 预览，则释放 blob */
  const handleCoverUrlInput = (next: string) => {
    const prev = formData.coverUrl;
    if (typeof prev === 'string' && prev.startsWith('blob:') && prev !== next) {
      coverPendingFilesRef.current.delete(prev);
      URL.revokeObjectURL(prev);
    }
    setFormData({ ...formData, coverUrl: next });
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && tag.length <= 20)
      .slice(0, 10);
    setFormData({ ...formData, tags });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      message.error('标题不能为空');
      return false;
    }
    if (formData.title.length > 50) {
      message.error('标题不能超过50个字符');
      return false;
    }
    if (!formData.routeId.trim()) {
      message.error('路由ID不能为空');
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(formData.routeId)) {
      message.error('路由ID只能包含小写字母、数字和连字符');
      return false;
    }
    if (!formData.summary.trim()) {
      message.error('摘要不能为空');
      return false;
    }
    if (formData.summary.length > 300) {
      message.error('摘要不能超过300个字符');
      return false;
    }
    if (!formData.coverUrl.trim()) {
      message.error('封面图片不能为空');
      return false;
    }
    if (formData.tags.length === 0) {
      message.error('至少需要一个标签');
      return false;
    }
    return true;
  };

  const handleSaveClick = async () => {
    if (!validateForm()) return;

    let payload = { ...formData };
    const u = payload.coverUrl;
    if (typeof u === 'string' && u.startsWith('blob:')) {
      const file = coverPendingFilesRef.current.get(u);
      if (!file) {
        message.error('封面仅在本地预览，请重新选择后再保存');
        return;
      }
      setUploading(true);
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: 0.8,
          fileType: 'image/jpeg',
        };
        const compressedFile = await imageCompression(file, options);
        const { data } = await uploadApi.uploadImage(compressedFile);
        coverPendingFilesRef.current.delete(u);
        URL.revokeObjectURL(u);
        payload = { ...payload, coverUrl: data.url };
        setFormData(payload);
      } catch (error) {
        console.error('Cover upload failed:', error);
        message.error('封面上传失败，请重试');
        return;
      } finally {
        setUploading(false);
      }
    }

    onSave(payload);
  };

  return (
    <div className="editor-form"> 
      <div className="editor-form-content">
        <div className="form-section">
          <FormLabel title="标题" require charCount={formData.title.length} charCountMax={50} />
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="请输入标题"
            maxLength={50}
            showCount={false}
          />
        </div>

        <div className="form-section">
          <FormLabel title="路由ID" require />
          <Input
            value={formData.routeId}
            onChange={(e) => setFormData({ ...formData, routeId: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
            placeholder="请输入路由ID（如：my-article-title）"
            disabled={!!formData.routeId && formData.routeId.length > 0}
          />
          <div className="form-hint">只能包含小写字母、数字和连字符，创建后不可修改</div>
        </div>

        <div className="form-section">
          <FormLabel title="摘要" require charCount={formData.summary.length} charCountMax={300} />
          <Input.TextArea
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="请输入摘要"
            rows={4}
            maxLength={300}
            showCount={false}
          />
        </div>

        <div className="form-section">
          <FormLabel title="封面图片" require />

          <DeferredImageUpload
            value={formData.coverUrl}
            onChange={(url) => setFormData({ ...formData, coverUrl: url })}
            pendingFilesRef={coverPendingFilesRef}
            commitHint="已选择，点击「保存」后上传服务器"
          />
          <Input
            style={{ marginTop: 8 }}
            value={formData.coverUrl}
            onChange={(e) => handleCoverUrlInput(e.target.value)}
            placeholder="或直接填写图片 URL"
          />
        </div>

        <div className="form-section">
          <FormLabel
            title="标签"
            require
            charCount={formData.tags.length}
            charCountMax={10}
            tips="使用逗号分隔多个标签"
          />
          <Input.TextArea
            rows={3}
            value={formData.tags.join(', ')}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="请输入标签，用逗号分隔（如：React, TypeScript, 前端开发）"
          />
          <div className="form-hint">最多10个标签，每个标签不超过20个字符</div>
          
          {formData.tags.length > 0 && (
            <div className="tags-preview">
              <Space size={[8, 8]} wrap>
                {formData.tags.map((tag, index) => (
                  <Tag key={index} closable onClose={() => {
                    const newTags = [...formData.tags];
                    newTags.splice(index, 1);
                    setFormData({ ...formData, tags: newTags });
                  }}>
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </div>
      </div>
      <div className="form-actions">
        <Button onClick={onCancel} disabled={saving}>
          取消
        </Button>
        <Button
          type="primary"
          onClick={handleSaveClick}
          loading={saving || uploading}
        >
          {saving ? '保存中...' : '保存'}
        </Button>
      </div>
    </div>
    
  );
};

export default EditorForm;