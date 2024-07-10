import { TransformFnParams } from 'class-transformer';
import * as dayjs from 'dayjs';

export const TimeAgoTransform =
  (format: string = 'YYYY-MM-DD HH:mm:ss') =>
  ({ value }: TransformFnParams) => {
    try {
      const diffMinutes = dayjs().diff(dayjs(value), 'minute');
      if (diffMinutes < 2) {
        return '刚刚';
      }
      if (diffMinutes < 60) {
        return `${diffMinutes}分钟前`;
      }
      if (diffMinutes < 1440) {
        return `${Math.floor(diffMinutes / 60)}小时前`;
      }
      return dayjs(value).format(format);
    } catch {
      return value;
    }
  };
