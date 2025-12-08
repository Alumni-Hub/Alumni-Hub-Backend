'use strict';

module.exports = {
  register({ strapi }) {
    // Register phase
  },

  async bootstrap({ strapi }) {
    // Bootstrap phase - runs after all plugins are loaded
    try {
      strapi.log.info('🔧 Checking batchmate permissions...');
      
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (!publicRole) {
        strapi.log.warn('Public role not found');
        return;
      }

      strapi.log.info(`Found public role with ID: ${publicRole.id}`);

      // Get all permissions for batchmate
      const batchmatePermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
        where: {
          role: publicRole.id,
          action: {
            $contains: 'api::batchmate.batchmate',
          },
        },
      });

      strapi.log.info(`Found ${batchmatePermissions.length} batchmate permissions`);

      // Enable all batchmate permissions
      for (const permission of batchmatePermissions) {
        await strapi.db.query('plugin::users-permissions.permission').update({
          where: { id: permission.id },
          data: { enabled: true },
        });
        strapi.log.info(`✅ Enabled: ${permission.action}`);
      }

      if (batchmatePermissions.length === 0) {
        strapi.log.warn('⚠️  No batchmate permissions found - they may need to be created first');
      }
    } catch (error) {
      strapi.log.error('Error enabling batchmate permissions:', error.message);
    }
  },
};
