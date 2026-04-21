import type { FC, RefObject } from 'react';
import { Upload, message, UploadFile } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// @ts-ignore antd-img-crop 无类型声明
import ImgCrop from 'antd-img-crop';

export type DeferredImageUploadProps = {
  value?: string;
  onChange?: (url: string) => void;
  /** blob 预览 URL → File，由父组件在「提交保存」时读取并上传 */
  pendingFilesRef: RefObject<Map<string, File>>;
  /** 选择文件后的提示，应说明在哪个按钮保存时会上传 */
  commitHint?: string;
  maxSizeMB?: number;
  /** 为 true 时用 ImgCrop 包裹（与推荐弹窗一致） */
  crop?: boolean;
};

/** 从 Map 中移除并 revoke 单个 blob 预览 */
export function revokeDeferredBlob(
  pendingFilesRef: RefObject<Map<string, File>>,
  url?: string,
): void {
  if (!url?.startsWith('blob:')) return;
  pendingFilesRef.current.delete(url);
  URL.revokeObjectURL(url);
}

/** 页面卸载或刷新前清空：释放所有 blob 与 File 引用（刷新后本就会丢，仅避免泄漏） */
export function clearAllDeferredBlobs(pendingFilesRef: RefObject<Map<string, File>>): void {
  for (const url of pendingFilesRef.current.keys()) {
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
  }
  pendingFilesRef.current.clear();
}

const pictureCardTrigger = (
  <div
    style={{
      width: '100px',
      height: '100px',
      border: '1px dashed #d9d9d9',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    }}
  >
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>上传</div>
  </div>
);

/**
 * 图片先以 blob 预览 + pendingFilesRef 持有 File，父组件在统一保存时再调 uploadApi。
 */
const DeferredImageUpload: FC<DeferredImageUploadProps> = ({
  value,
  onChange,
  pendingFilesRef,
  commitHint = '已选择，请在保存时上传服务器',
  maxSizeMB = 5,
  crop,
}) => {
  const fileList: UploadFile[] = value
    ? [
        {
          uid: '-1',
          name: value.split('/').pop() || 'image.png',
          status: 'done',
          url: value,
          thumbUrl: value,
        },
      ]
    : [];

  const revokeIfBlob = (url?: string) => revokeDeferredBlob(pendingFilesRef, url);

  const upload = (
    <Upload
      name="file"
      listType="picture-card"
      fileList={fileList}
      maxCount={1}
      accept="image/*"
      onChange={({ fileList: next }) => {
        if (next.length === 0) {
          revokeIfBlob(value);
          onChange?.('');
        }
      }}
      beforeUpload={(file) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
          message.error(`文件大小不能超过 ${maxSizeMB}MB`);
          return false;
        }
        revokeIfBlob(value);
        const previewUrl = URL.createObjectURL(file);
        pendingFilesRef.current.set(previewUrl, file);
        onChange?.(previewUrl);
        message.success(commitHint);
        return false;
      }}
      onRemove={() => {
        revokeIfBlob(value);
        onChange?.('');
      }}
    >
      {fileList.length === 0 && pictureCardTrigger}
    </Upload>
  );

  return crop ? <ImgCrop>{upload}</ImgCrop> : upload;
};

export default DeferredImageUpload;
