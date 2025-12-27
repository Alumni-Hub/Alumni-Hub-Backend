/**
 * event controller
 */

import { factories } from '@strapi/strapi';
const QRCode = require('qrcode');

export default factories.createCoreController('api::event.event', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || '*',
    };
    
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    
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

  /**
   * Generate QR code for an event
   */
  async generateQRCode(ctx) {
    try {
      const { id } = ctx.params;
      
      const event = await strapi.entityService.findOne('api::event.event', id);
      
      if (!event) {
        return ctx.notFound('Event not found');
      }

      // Generate QR code URL (this will redirect to the public attendance form)
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const qrCodeUrl = `${frontendUrl}/attendance/register?eventId=${id}`;
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
        width: 500,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Update event with QR code data
      const updatedEvent = await strapi.entityService.update('api::event.event', id, {
        data: {
          qrCode: qrCodeDataUrl,
          qrCodeUrl: qrCodeUrl,
        },
      });

      return {
        qrCode: qrCodeDataUrl,
        qrCodeUrl: qrCodeUrl,
        event: updatedEvent,
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  /**
   * Get event statistics including QR scan vs manual attendance
   */
  async getStatistics(ctx) {
    try {
      const { id } = ctx.params;
      
      // Get all attendances for this event
      const attendances = await strapi.entityService.findMany('api::event-attendance.event-attendance', {
        filters: {
          event: id,
        },
        populate: ['batchmate'],
      });
      
      // Get event details
      const event = await strapi.entityService.findOne('api::event.event', id);
      
      if (!event) {
        return ctx.notFound('Event not found');
      }
      
      const stats = {
        total: attendances.length,
        present: attendances.filter(a => a.status === 'Present').length,
        absent: attendances.filter(a => a.status === 'Absent').length,
        pending: attendances.filter(a => a.status === 'Pending').length,
        qrScanned: attendances.filter(a => a.attendanceMethod === 'QR_SCAN').length,
        manual: attendances.filter(a => a.attendanceMethod === 'MANUAL').length,
        notMarked: attendances.filter(a => a.attendanceMethod === 'NOT_MARKED').length,
      };

      return {
        event: {
          id: event.id,
          name: event.name,
          eventDate: event.eventDate,
          venue: event.venue,
        },
        statistics: stats,
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}));
