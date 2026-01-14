"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["AUDIT"] = "AUDIT";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    static info(message, context) {
        this.log(LogLevel.INFO, message, context);
    }
    static warn(message, context) {
        this.log(LogLevel.WARN, message, context);
    }
    static error(message, error, context) {
        this.log(LogLevel.ERROR, message, {
            ...context,
            error_name: error?.name,
            error_message: error?.message,
            stack: error?.stack,
        });
    }
    static audit(message, context) {
        this.log(LogLevel.AUDIT, message, context);
    }
    static log(level, message, context) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
        };
        // In production, this would pipe to stdout for Log Aggregator
        console.log(JSON.stringify(entry));
    }
}
exports.Logger = Logger;
