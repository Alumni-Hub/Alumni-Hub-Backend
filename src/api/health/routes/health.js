/**
 * Health check route for keeping backend alive
 * This lightweight endpoint is used by monitoring services to prevent cold starts
 */

'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/health',
      handler: 'health.check',
      config: {
        auth: false, // No authentication required for health checks
        policies: [],
        middlewares: [],
      },
    },
  ],
};
