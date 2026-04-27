import type { FC, RefObject } from 'react';
import { useMemo } from 'react';
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
  /**
   * 若设置，在生成预览前用 canvas 将图缩放为该像素尺寸（如推荐位图标 64×64）。
   * 输出为 PNG 以保证透明底兼容。
   */
  outputSize?: { width: number; height: number };
};

/**
 * 将整图按宽高比 **适应** 到固定画布（不裁剪：不足处透明留白），输出 PNG。
 * 与矩形框的关系类似 object-fit: contain。
 */
export async function resizeImageFileToPixels(
  file: File,
  width: number,
  height: number,
): Promise<File> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(new Error('read file'));
    fr.readAsDataURL(file);
  });

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('no 2d context'));
        return;
      }
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (iw < 1 || ih < 1) {
        reject(new Error('invalid image size'));
        return;
      }
      const scale = Math.min(width / iw, height / ih);
      const dw = Math.round(iw * scale);
      const dh = Math.round(ih * scale);
      const dx = Math.floor((width - dw) / 2);
      const dy = Math.floor((height - dh) / 2);
      // 透明底，不填充（PNG 透区）
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, dx, dy, dw, dh);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('toBlob failed'));
            return;
          }
          const base = file.name.replace(/\.[^.\\/]+$/, '') || 'image';
          resolve(new File([blob], `${base}.png`, { type: 'image/png' }));
        },
        'image/png',
        0.95,
      );
    };
    img.onerror = () => reject(new Error('image decode'));
    img.src = dataUrl;
  });
}

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
  outputSize,
}) => {
  // 有固定输出尺寸时略放大点击区，实际像素仍由 outputSize 控制
  const cardSize = outputSize ? 80 : 100;
  const pictureCardTrigger = useMemo(
    () => (
      <div
        style={{
          width: cardSize,
          height: cardSize,
          border: '1px dashed #d9d9d9',
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <PlusOutlined />
        <div style={{ marginTop: 4, fontSize: 12 }}>上传</div>
        {outputSize && (
          <div style={{ marginTop: 2, fontSize: 10, color: 'rgba(0,0,0,0.45)' }}>
            {outputSize.width}×{outputSize.height}
          </div>
        )}
      </div>
    ),
    [cardSize, outputSize],
  );

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
      beforeUpload={async (file) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
          message.error(`文件大小不能超过 ${maxSizeMB}MB`);
          return false;
        }
        revokeIfBlob(value);
        let fileToStore: File = file;
        if (outputSize) {
          try {
            fileToStore = await resizeImageFileToPixels(
              file,
              outputSize.width,
              outputSize.height,
            );
          } catch (e) {
            console.error(e);
            message.error('图片处理失败，请重试或换一张图片');
            return false;
          }
        }
        const previewUrl = URL.createObjectURL(fileToStore);
        pendingFilesRef.current.set(previewUrl, fileToStore);
        onChange?.(previewUrl);
        message.success(commitHint);
        return false;
      }}
      onRemove={() => {
        revokeIfBlob(value);
        onChange?.('');
      }}
      style={{ border: 'none' }}
    >
      {fileList.length === 0 && pictureCardTrigger}
    </Upload>
  );

  if (crop) {
    return (
      <ImgCrop
        aspect={1}
        rotationSlider
        quality={1}
        modalTitle={
          outputSize
            ? `裁剪为方形（将输出 ${outputSize.width}×${outputSize.height} 像素）`
            : '裁剪图片'
        }
      >
        {upload}
      </ImgCrop>
    );
  }

  return upload;
};

export default DeferredImageUpload;
