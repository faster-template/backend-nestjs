export enum EMaterialType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  OTHER = 'other',
}

export enum EOssType {
  QINIU = 'qiniu',
  OTHER = 'other',
}

export enum EFolder {
  ROOT = '', // 根目录
  AVATAR = 'avatar', // 用户头像
  BANNER = 'banner', // Banner
  ICON = 'icon', // 图标
  CONTENT = 'content', // 内容，富文本
  USERCONTENT = 'usercontent', // 用户内容
  VIDEO = 'video', // 视频
  FILE = 'file', // 文件
  AUDIO = 'audio', // 音频
  OTHER = 'other', // 其他
  MATERIAL = 'material',
}
