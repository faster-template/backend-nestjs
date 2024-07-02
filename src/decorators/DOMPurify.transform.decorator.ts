import { TransformFnParams } from 'class-transformer';
import { JSDOM } from 'jsdom';
import * as DOMPurify from 'dompurify';

export const DOMPurifyTransform =
  (option?: DOMPurify.Config) =>
  ({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      const window = new JSDOM('').window;
      const purify = DOMPurify(window);
      const result = option
        ? purify.sanitize(value, option)
        : purify.sanitize(value);
      // 这里可以加入日志记录有XSS攻击出现
      // if(result !== value){
      //   console.log('XSS攻击', value)
      // }
      return result;
    }
    return value;
  };
