export interface IResponseData {
  success: boolean; // 是否成功
  code: number; // 一个和前端对齐的code
  data?: any; // 返回的数据
  message?: string; // 当错误的时候会抛出消息
}
