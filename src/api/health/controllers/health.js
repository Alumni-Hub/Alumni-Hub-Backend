/**
 * Health check controller
 * Returns a lightweight response to confirm the server is running
 */

'use strict';

module.exports = {
  async check(ctx) {
    ctx.body = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'alumni-hub-backend',
    };
  },
};
