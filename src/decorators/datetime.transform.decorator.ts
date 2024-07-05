import { TransformFnParams } from 'class-transformer';
import * as dayjs from 'dayjs';

export const DateTimeTransform =
  (format: string = 'YYYY-MM-DD HH:mm:ss') =>
  ({ value }: TransformFnParams) => {
    try {
      return dayjs(value).format(format);
    } catch {
      return value;
    }
  };
