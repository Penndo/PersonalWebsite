import type { RecommendedItem, UserInfo } from '@/types';

/** 归一化为本站 `/uploads/xxx`；blob 或非本站路径返回 null */
export function canonicalUploadsPath(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string' || url.startsWith('blob:')) return null;
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const p = new URL(url).pathname;
      return p.startsWith('/uploads/') ? p : null;
    }
  } catch {
    return null;
  }
  return url.startsWith('/uploads/') ? url : null;
}

export function collectUploadPathsFromRecommendations(items: RecommendedItem[]): Set<string> {
  const s = new Set<string>();
  for (const it of items) {
    for (const u of [it.defaultImage, it.hoverImage]) {
      const c = canonicalUploadsPath(u);
      if (c) s.add(c);
    }
  }
  return s;
}

export function collectUploadPathsFromUser(
  u: Pick<UserInfo, 'avatar' | 'wechatQRCode' | 'portfolio'> | null | undefined,
): Set<string> {
  const s = new Set<string>();
  if (!u) return s;
  for (const key of ['avatar', 'wechatQRCode', 'portfolio'] as const) {
    const c = canonicalUploadsPath(u[key]);
    if (c) s.add(c);
  }
  return s;
}
