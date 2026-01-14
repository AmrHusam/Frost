import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, url, ip } = req;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;

        Logger.info('HTTP Request', {
            method,
            url,
            status: statusCode,
            duration_ms: duration,
            ip
        });
    });

    next();
};
