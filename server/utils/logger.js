const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');
const { format } = winston;
require('winston-daily-rotate-file');

// Custom format for structured logging
const customFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.metadata(),
  format.json()
);

// Configure log directory
const LOG_DIR = process.env.LOG_DIR || 'logs';
const MAX_SIZE = '20m';
const MAX_FILES = '14d';

// Create log directory if it doesn't exist
require('fs').mkdirSync(LOG_DIR, { recursive: true });

// Configure Elasticsearch transport (if enabled)
const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL,
    auth: {
      username: process.env.ELASTICSEARCH_USER,
      password: process.env.ELASTICSEARCH_PASSWORD,
    },
  },
  indexPrefix: 'q-economics-logs',
};

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { service: 'q-economics' },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    }),

    // Rotating file transport for all logs
    new winston.transports.DailyRotateFile({
      filename: `${LOG_DIR}/combined-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: MAX_SIZE,
      maxFiles: MAX_FILES,
    }),

    // Separate file for error logs
    new winston.transports.DailyRotateFile({
      filename: `${LOG_DIR}/error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: MAX_SIZE,
      maxFiles: MAX_FILES,
      level: 'error',
    }),

    // Separate file for access logs
    new winston.transports.DailyRotateFile({
      filename: `${LOG_DIR}/access-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: MAX_SIZE,
      maxFiles: MAX_FILES,
    }),
  ],
});

// Add Elasticsearch transport if configured
if (process.env.ELASTICSEARCH_URL) {
  logger.add(new ElasticsearchTransport(esTransportOpts));
}

// Create a stream for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.info(message.trim(), { type: 'access' });
  },
};

// Log uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new winston.transports.DailyRotateFile({
    filename: `${LOG_DIR}/exceptions-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: MAX_SIZE,
    maxFiles: MAX_FILES,
  })
);

logger.rejections.handle(
  new winston.transports.DailyRotateFile({
    filename: `${LOG_DIR}/rejections-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: MAX_SIZE,
    maxFiles: MAX_FILES,
  })
);

// Helper functions for structured logging
const logWithContext = (level, message, context = {}) => {
  logger.log({
    level,
    message,
    ...context,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  logger,
  info: (message, context) => logWithContext('info', message, context),
  error: (message, context) => logWithContext('error', message, context),
  warn: (message, context) => logWithContext('warn', message, context),
  debug: (message, context) => logWithContext('debug', message, context),
  http: (message, context) => logWithContext('http', message, context),
};
