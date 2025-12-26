/**
 * notification controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::notification.notification', ({ strapi }) => ({
  async find(ctx) {
    // Use the default find with populate
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || '*',
    };
    
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    
    // Use the default findOne with populate
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || '*',
    };

    const response = await super.findOne(ctx);
    return response;
  },

  async create(ctx) {
    const response = await super.create(ctx);
    return response;
  },

  async update(ctx) {
    const response = await super.update(ctx);
    return response;
  },

  async delete(ctx) {
    const response = await super.delete(ctx);
    return response;
  },
}));
