import fs from 'fs';
import winston from 'winston';

import authSupport from './auth/authSupport';
import config from './config';
import { SpeilRequest } from './types';

('use strict');

const sikkerLogPath = () => (fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log');

const stdoutLogger = winston.createLogger({
    level: 'debug',
    format: config.development ? winston.format.cli() : winston.format.json(),
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

const requestMeta = (req: SpeilRequest) => {
    return {
        speilUser: authSupport.valueFromClaim('name', req.session.speilToken),
        navIdent: authSupport.valueFromClaim('NAVident', req.session.speilToken),
        headers: req.headers,
        method: req.method,
        url: req.url,
        httpVersion: req.httpVersion,
        path: req.path,
        protocol: req.protocol,
        query: req.query,
        hostname: req.hostname,
        ip: req.ip,
        originalUrl: req.originalUrl,
        params: req.params,
    };
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
    requestMeta,
};
