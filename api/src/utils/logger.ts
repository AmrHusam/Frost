export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    AUDIT = 'AUDIT',
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: Record<string, any>;
    traceId?: string;
}

export class Logger {
    static info(message: string, context?: Record<string, any>) {
        this.log(LogLevel.INFO, message, context);
    }

    static warn(message: string, context?: Record<string, any>) {
        this.log(LogLevel.WARN, message, context);
    }

    static error(message: string, error?: Error, context?: Record<string, any>) {
        this.log(LogLevel.ERROR, message, {
            ...context,
            error_name: error?.name,
            error_message: error?.message,
            stack: error?.stack,
        });
    }

    static audit(message: string, context?: Record<string, any>) {
        this.log(LogLevel.AUDIT, message, context);
    }

    private static log(level: LogLevel, message: string, context?: Record<string, any>) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
        };

        // In production, this would pipe to stdout for Log Aggregator
        console.log(JSON.stringify(entry));
    }
}
