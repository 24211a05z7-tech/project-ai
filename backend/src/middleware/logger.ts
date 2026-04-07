import morgan from 'morgan';
import { env } from '../config/env';

const format =
  env.NODE_ENV === 'production'
    ? ':remote-addr - :method :url :status :res[content-length] - :response-time ms'
    : ':method :url :status :response-time ms - :res[content-length]';

export const requestLogger = morgan(format);
