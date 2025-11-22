import { inspect } from "node:util";

type LogLevel = "debug" | "info" | "warn" | "error";
type OutputFormat = "json" | "text";

interface LoggerConfig {
  level?: LogLevel;
  format?: OutputFormat;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private level: LogLevel;
  private format: OutputFormat;
  private namespace?: string;

  constructor(namespace?: string, config: LoggerConfig = {}) {
    this.namespace = namespace;
    this.level = config.level || "info";
    this.format = config.format || "text";
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.level];
  }

  private formatMessage(level: LogLevel, message: string, data?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level,
      namespace: this.namespace,
      message,
      ...data,
    };

    if (this.format === "json") {
      return JSON.stringify(entry);
    }

    const parts: string[] = [];
    parts.push(`[${timestamp}]`);
    parts.push(`[${level.toUpperCase()}]`);
    if (this.namespace) {
      parts.push(`[${this.namespace}]`);
    }
    parts.push(message);

    if (data && Object.keys(data).length > 0) {
      parts.push(inspect(data, { colors: false, depth: null }));
    }

    return parts.join(" ");
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, data));
    }
  }

  info(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, data));
    }
  }

  warn(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, data));
    }
  }

  error(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, data));
    }
  }
}

const loggers = new Map<string, Logger>();

function getDefaultLogLevel(): LoggerConfig["level"] {
  if (process.env.NODE_ENV === "test") return "error";
  if (process.env.NODE_ENV === "production") return "info";
  return "debug";
}

const defaultLoggingConfig: LoggerConfig = {
  level: getDefaultLogLevel(),
  format: process.env.NODE_ENV === "production" ? "json" : "text",
};

export function getLogger(namespace?: string, config?: Partial<LoggerConfig>): Logger {
  const key = namespace || "default";
  if (!loggers.has(key)) {
    loggers.set(key, new Logger(namespace, { ...defaultLoggingConfig, ...config }));
  }
  return loggers.get(key)!;
}
