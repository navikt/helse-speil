'use strict';

import winston from 'winston';
import fs from 'fs';

const sikkerLogPath = () => (fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log');

const stdoutLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

const sikkerLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: sikkerLogPath(), maxsize: 5242880 })],
});

const info = (message: string, ...meta: any[]) => {
    stdoutLogger.info(message, ...meta);
};

const warning = (message: string, ...meta: any[]) => {
    stdoutLogger.warn(message, ...meta);
};

const error = (message: string, ...meta: any[]) => {
    stdoutLogger.error(message, ...meta);
};

const sikkerInfo = (message: string, ...meta: any[]) => {
    sikkerLogger.info(message, ...meta);
};

const sikkerWarning = (message: string, ...meta: any[]) => {
    sikkerLogger.warning(message, ...meta);
};

const sikkerError = (message: string, ...meta: any[]) => {
    sikkerLogger.error(message, ...meta);
};

export default {
    info,
    warning,
    error,
    sikker: {
        info: sikkerInfo,
        warning: sikkerWarning,
        error: sikkerError,
    },
};
