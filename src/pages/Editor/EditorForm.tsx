import { useState } from 'react';
import { Input, Button, Upload, Image, Tag, Space, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadApi } from '@/services/api';
import imageCompression from 'browser-image-compression';
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
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

const EditorForm: React.FC<EditorFormProps> = ({
  formData,
  setFormData,
  onSave,
  onCancel,
  saving,
}) => {
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
      setFormData({ ...formData, coverUrl: response.data.url });
      message.success('图片上传成功');
    } catch (error) {
      console.error('Image upload failed:', error);
      message.error('图片上传失败，请重试');
    } finally {
      setUploading(false);
    }
    return false;
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

  const handleSaveClick = () => {
    if (validateForm()) {
      onSave();
    }
  };

  return (
    <div className="editor-form"> 
      <div className="editor-form-content">
        <div className="form-section">
          <label className="form-label">
            标题 <span className="required">*</span>
            <span className="char-count">{formData.title.length}/50</span>
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="请输入标题"
            maxLength={50}
            showCount={false}
          />
        </div>

        <div className="form-section">
          <label className="form-label">
            路由ID <span className="required">*</span>
          </label>
          <Input
            value={formData.routeId}
            onChange={(e) => setFormData({ ...formData, routeId: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
            placeholder="请输入路由ID（如：my-article-title）"
            disabled={!!formData.routeId && formData.routeId.length > 0}
          />
          <div className="form-hint">只能包含小写字母、数字和连字符，创建后不可修改</div>
        </div>

        <div className="form-section">
          <label className="form-label">
            摘要 <span className="required">*</span>
            <span className="char-count">{formData.summary.length}/300</span>
          </label>
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
          <label className="form-label">
            封面图片 <span className="required">*</span>
          </label>
          
          {formData.coverUrl && (
            <div className="cover-preview">
              <Image
                src={formData.coverUrl}
                alt="封面预览"
              />
              <Button
                type="text"
                danger
                onClick={() => setFormData({ ...formData, coverUrl: '' })}
                className="remove-cover"
              >
                删除
              </Button>
            </div>
          )}

          <Upload.Dragger
            name="file"
            multiple={false}
            beforeUpload={handleImageUpload}
            showUploadList={false}
            disabled={uploading}
            accept="image/*"
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            <p className="ant-upload-hint">
              支持 JPG、PNG 等格式，自动压缩至1MB以内
            </p>
          </Upload.Dragger>

          <div className="form-divider">或</div>

          <Input
            placeholder="或直接输入图片 URL"
            value={formData.coverUrl}
            onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
          />
        </div>

        <div className="form-section">
          <label className="form-label">
            标签 <span className="required">*</span>
            <span className="char-count">{formData.tags.length}/10</span>
          </label>
          <Input
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