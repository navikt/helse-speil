'use strict';

const winston = require('winston');
const fs = require('fs');

const auditLogPath = () =>
    fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log';

const stdoutLogger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

const auditLogger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [new winston.transports.File({ filename: auditLogPath(), maxsize: 5242880 })]
});

const info = msg => {
    stdoutLogger.info(msg);
};

const warning = msg => {
    stdoutLogger.warn(msg);
};

const error = (msg, err) => {
    stdoutLogger.error(msg, err && { message: `: ${err?.message || err}` });
};

const audit = msg => {
    auditLogger.info(msg);
};

module.exports = {
    info,
    warning,
    error,
    audit
};
