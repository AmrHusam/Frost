"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = require("../utils/logger");
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, url, ip } = req;
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;
        logger_1.Logger.info('HTTP Request', {
            method,
            url,
            status: statusCode,
            duration_ms: duration,
            ip
        });
    });
    next();
};
exports.requestLogger = requestLogger;
