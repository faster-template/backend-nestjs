// 限制上传的文件类型

export const acceptImages = [
  // 图片
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
];

export const acceptVideos = [
  // 视频
  'video/mp4',
  'video/x-flv',
  'video/ogg',
  'video/webm',
];

export const acceptAudios = [
  // 音频
  'audio/mpeg',
  'audio/ogg',
];

export const acceptDocs = [
  // 文档
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/pdf',
  'text/plain',
];

export const acceptTypes = [
  ...acceptImages,
  ...acceptAudios,
  ...acceptVideos,
  ...acceptDocs,
];
