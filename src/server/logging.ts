'use strict';

import winston from 'winston';
import fs from 'fs';

const auditLogPath = () => (fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log');

const stdoutLogger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

const auditLogger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [new winston.transports.File({ filename: auditLogPath(), maxsize: 5242880 })],
});

const info = (message: string) => {
    stdoutLogger.info(message);
};

const warning = (message: string) => {
    stdoutLogger.warn(message);
};

const error = (message: string, err?: Error) => {
    stdoutLogger.error(message, err && { message: `: ${err?.message || err}` });
};

const audit = (message: string) => {
    auditLogger.info(message);
};

export default {
    info,
    warning,
    error,
    audit,
};
