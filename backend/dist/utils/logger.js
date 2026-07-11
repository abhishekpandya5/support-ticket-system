import { getEnv } from '../config/env.js';
const LEVEL_PRIORITY = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};
function shouldLog(level) {
    try {
        const configured = getEnv().LOG_LEVEL;
        return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[configured];
    }
    catch {
        return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY.info;
    }
}
function write(level, namespace, message, meta) {
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
export function createLogger(namespace) {
    return {
        debug: (message, meta) => write('debug', namespace, message, meta),
        info: (message, meta) => write('info', namespace, message, meta),
        warn: (message, meta) => write('warn', namespace, message, meta),
        error: (message, meta) => write('error', namespace, message, meta),
    };
}
//# sourceMappingURL=logger.js.map