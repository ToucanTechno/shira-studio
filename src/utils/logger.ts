const isDevelopment = true;//process.env['NODE_ENV'] === 'development';

export const logger = {
    log: (...args: unknown[]) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },
    error: (...args: unknown[]) => {
        if (isDevelopment) {
            console.error(...args);
        }
    },
    warn: (...args: unknown[]) => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },
    debug: (...args: unknown[]) => {
        if (isDevelopment) {
            console.debug(...args);
        }
    },
    // Component lifecycle logging with timestamp
    component: (componentName: string, action: string, data?: unknown) => {
        if (isDevelopment) {
            const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
            const dataStr = data !== undefined ? ` | Data: ${JSON.stringify(data)}` : '';
            console.log(`[${timestamp}] 🔄 ${componentName} - ${action}${dataStr}`);
        }
    },
    // State change logging
    state: (componentName: string, stateName: string, oldValue: unknown, newValue: unknown) => {
        if (isDevelopment) {
            const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
            console.log(`[${timestamp}] 📊 ${componentName} - ${stateName}: ${JSON.stringify(oldValue)} → ${JSON.stringify(newValue)}`);
        }
    }
};