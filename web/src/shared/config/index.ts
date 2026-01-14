/**
 * Production-Safe Environment Configuration
 * 
 * This module enforces strict validation of environment variables.
 * In production, missing critical VITE_* variables will cause a fatal error.
 */

interface FrostConfig {
    readonly BACKEND_URL: string;
    readonly SOCKET_URL: string;
    readonly ENFORCE_SSL: boolean;
}

const getEnv = (key: string, required: boolean = true): string => {
    const value = import.meta.env[key];

    if (required && !value) {
        const errorMsg = `[FATAL] Configuration Error: Missing required environment variable "${key}".`;
        console.error(errorMsg);

        // Fail fast in production
        if (import.meta.env.PROD) {
            throw new Error(errorMsg);
        }
    }

    return value || '';
};

export const config: FrostConfig = {
    BACKEND_URL: getEnv('VITE_BACKEND_URL'),
    SOCKET_URL: getEnv('VITE_SOCKET_URL'),
    ENFORCE_SSL: import.meta.env.PROD,
};
