/**
 * batchmate controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::batchmate.batchmate', ({ strapi }) => ({
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
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    
    const response = await super.update(ctx);
    
    // If attendance was updated, sync with event-attendance records
    if (data && data.attendance) {
      try {
        const batchmate = response.data;
        
        strapi.log.info(`Attempting to sync attendance for batchmate id: ${batchmate.id}, documentId: ${batchmate.documentId}`);
        
        // Find all event-attendance records for this batchmate using numeric id
        const attendanceRecords = await strapi.entityService.findMany('api::event-attendance.event-attendance', {
          filters: {
            batchmate: {
              id: batchmate.id,
            },
          },
          populate: ['event', 'batchmate'],
        });
        
        strapi.log.info(`Found ${attendanceRecords.length} event-attendance records to sync`);
        
        // Update all event-attendance records to match the batchmate attendance status
        const attendanceStatus = data.attendance === 'Present' ? 'Present' : 'Absent';
        
        for (const record of attendanceRecords) {
          strapi.log.info(`Updating event-attendance record ${record.id} to status: ${attendanceStatus}`);
          await strapi.entityService.update('api::event-attendance.event-attendance', record.id, {
            data: {
              status: attendanceStatus,
              attendanceMethod: record.attendanceMethod || 'MANUAL',
              markedAt: new Date(),
            },
          });
        }
        
        strapi.log.info(`Successfully synced attendance for batchmate ${batchmate.id} to ${attendanceRecords.length} event(s)`);
      } catch (error) {
        strapi.log.error('Error syncing attendance to event-attendance:', error);
        // Don't fail the update if sync fails
      }
    }
    
    return response;
  },

  async delete(ctx) {
    const response = await super.delete(ctx);
    return response;
  },
}));
