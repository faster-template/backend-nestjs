export enum EState {
  // 禁用
  Disable = -2,
  // 软删除
  SoftDeleted = -1,
  // 正常
  Normal = 1,
  // 草稿
  Draft = 0,
  // 待审核
  Pending = 2,
}

export enum EArticleContentMode {
  RICHTEXT = 'richtext',
  MARKDOWN = 'markdown',
}
