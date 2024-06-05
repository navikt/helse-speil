'use strict';

import fs from 'fs';
import winston from 'winston';

import { erLokal } from './env';

const sikkerLogPath = () => (fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log');

const stdoutLogger = winston.createLogger({
    level: 'debug',
    format: erLokal ? winston.format.cli() : winston.format.json(),
    transports: [new winston.transports.Console()],
});

const sikkerLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: sikkerLogPath(), maxsize: 5242880 })],
});

const debug = (message: string, ...meta: unknown[]) => {
    stdoutLogger.debug(message, ...meta);
};
const info = (message: string, ...meta: unknown[]) => {
    stdoutLogger.info(message, ...meta);
};

const warn = (message: string, ...meta: unknown[]) => {
    stdoutLogger.warn(message, ...meta);
};

const error = (message: string, ...meta: unknown[]) => {
    stdoutLogger.error(message, ...meta);
};

const sikkerInfo = (message: string, ...meta: unknown[]) => {
    sikkerLogger.info(message, ...meta);
};

const sikkerWarn = (message: string, ...meta: unknown[]) => {
    sikkerLogger.warn(message, ...meta);
};

const sikkerError = (message: string, ...meta: unknown[]) => {
    sikkerLogger.error(message, ...meta);
};

export default {
    debug,
    info,
    warn,
    error,
    sikker: {
        info: sikkerInfo,
        warn: sikkerWarn,
        error: sikkerError,
    },
};
