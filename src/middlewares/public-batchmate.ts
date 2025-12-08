'use strict';

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Allow public access to batchmate API endpoints
    if (ctx.request.url.startsWith('/api/batchmates')) {
      // Skip permission checks for batchmate endpoints
      return next();
    }
    return next();
  };
};
