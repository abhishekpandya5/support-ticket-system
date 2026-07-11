import { getEnv } from '../config/env.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

function shouldLog(level: LogLevel): boolean {
  try {
    const configured = getEnv().LOG_LEVEL;
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[configured];
  } catch {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY.info;
  }
}

function write(
  level: LogLevel,
  namespace: string,
  message: string,
  meta?: Record<string, unknown>,
): void {
  if (!shouldLog(level)) {
    return;
  }

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    namespace,
    message,
    ...(meta ? { meta } : {}),
  };

  const output = JSON.stringify(entry);

  switch (level) {
    case 'error':
      console.error(output);
      break;
    case 'warn':
      console.warn(output);
      break;
    default:
      console.log(output);
  }
}

export function createLogger(namespace: string): Logger {
  return {
    debug: (message, meta) => write('debug', namespace, message, meta),
    info: (message, meta) => write('info', namespace, message, meta),
    warn: (message, meta) => write('warn', namespace, message, meta),
    error: (message, meta) => write('error', namespace, message, meta),
  };
}
