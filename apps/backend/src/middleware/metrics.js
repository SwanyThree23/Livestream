import logger from '../utils/logger.js';

/**
 * Metrics tracking middleware
 * Tracks request/response times and status codes
 */
export const metricsMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Capture original end function
  const originalEnd = res.end;

  // Override end function to capture metrics
  res.end = function(...args) {
    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Log request metrics
    logger.info({
      type: 'request',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.userId || 'anonymous',
    });

    // Store metrics in request for potential use
    req.metrics = {
      responseTime,
      statusCode: res.statusCode,
    };

    // Call original end function
    originalEnd.apply(res, args);
  };

  next();
};

/**
 * Simple in-memory metrics store
 * In production, use Redis or a proper metrics service
 */
class MetricsStore {
  constructor() {
    this.requests = [];
    this.maxSize = 1000; // Keep last 1000 requests
  }

  addRequest(metrics) {
    this.requests.push({
      ...metrics,
      timestamp: new Date(),
    });

    // Keep array size manageable
    if (this.requests.length > this.maxSize) {
      this.requests.shift();
    }
  }

  getStats() {
    const total = this.requests.length;
    if (total === 0) {
      return {
        total: 0,
        avgResponseTime: 0,
        statusCodes: {},
      };
    }

    const avgResponseTime = this.requests.reduce((sum, r) => sum + r.responseTime, 0) / total;
    const statusCodes = this.requests.reduce((acc, r) => {
      acc[r.statusCode] = (acc[r.statusCode] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      avgResponseTime: Math.round(avgResponseTime),
      statusCodes,
    };
  }

  clear() {
    this.requests = [];
  }
}

export const metricsStore = new MetricsStore();
