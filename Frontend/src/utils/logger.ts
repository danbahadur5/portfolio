type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  context?: string;
}

class Logger {
  private static instance: Logger;
  private isProd = import.meta.env.PROD;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(entry: LogEntry) {
    const formattedMessage = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.context ? `[${entry.context}] ` : ''}${entry.message}`;

    if (this.isProd) {
      // In production, you might want to send logs to an external service like Sentry, LogRocket, or a custom endpoint
      if (entry.level === 'error') {
        console.error(formattedMessage, entry.data || '');
      } else if (entry.level === 'warn') {
        console.warn(formattedMessage, entry.data || '');
      }
      // Info and debug are often suppressed in production unless needed
    } else {
      switch (entry.level) {
        case 'info':
          console.info(formattedMessage, entry.data || '');
          break;
        case 'warn':
          console.warn(formattedMessage, entry.data || '');
          break;
        case 'error':
          console.error(formattedMessage, entry.data || '');
          break;
        case 'debug':
          console.debug(formattedMessage, entry.data || '');
          break;
      }
    }
  }

  private createEntry(level: LogLevel, message: string, data?: any, context?: string): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      context,
    };
  }

  public info(message: string, data?: any, context?: string) {
    this.log(this.createEntry('info', message, data, context));
  }

  public warn(message: string, data?: any, context?: string) {
    this.log(this.createEntry('warn', message, data, context));
  }

  public error(message: string, data?: any, context?: string) {
    this.log(this.createEntry('error', message, data, context));
  }

  public debug(message: string, data?: any, context?: string) {
    this.log(this.createEntry('debug', message, data, context));
  }
}

export const logger = Logger.getInstance();
