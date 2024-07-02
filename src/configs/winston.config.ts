import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const timeZone = 'Asia/Shanghai';

// 自定义时间格式化函数
const timestampFormat = () => {
  return new Date().toLocaleString('zh-CN', { timeZone });
};

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampFormat }),
        nestWinstonModuleUtilities.format.nestLike('NestJS', {
          prettyPrint: true,
        }),
      ),
    }),
    // 配置其他transports（如文件日志）的示例
    new DailyRotateFile({
      filename: './logs/%DATE%_error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // 是否压缩旧文件
      maxSize: '20m',
      maxFiles: '14d', // 保留最近14天的日志
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampFormat }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      ),
    }),
    new DailyRotateFile({
      filename: './logs/%DATE%_info.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // 是否压缩旧文件
      maxSize: '20m',
      maxFiles: '14d', // 保留最近14天的日志
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampFormat }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      ),
    }),
  ],
};
