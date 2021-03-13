'use strict';

import winston from 'winston';
import fs from 'fs';

const auditLogPath = () => (fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log');

const stdoutLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

const auditLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: auditLogPath(), maxsize: 5242880 })],
});

const info = (message: string, ...meta: any[]) => {
    stdoutLogger.info(message, ...meta);
};

const warning = (message: string, ...meta: any[]) => {
    stdoutLogger.warn(message, ...meta);
};

const error = (message: string, err?: Error) => {
    stdoutLogger.error(message, err && { message: `: ${err?.message || err}` });
};

const audit = (message: string, ...meta: any[]) => {
    auditLogger.info(message, ...meta);
};

export default {
    info,
    warning,
    error,
    audit,
};
