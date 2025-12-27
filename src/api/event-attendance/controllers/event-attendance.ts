/**
 * event-attendance controller
 */

import { factories } from '@strapi/strapi';

/**
 * Normalize phone number to standard format (94XXXXXXXXX)
 * Handles: +94714007983, 0714007983, 94714007983
 */
function normalizePhoneNumber(phone: string): string {
  if (!phone) return phone;
  
  // Remove all spaces, dashes, and parentheses
  let normalized = phone.replace(/[\s\-\(\)]/g, '');
  
  // Remove leading + if present
  if (normalized.startsWith('+')) {
    normalized = normalized.substring(1);
  }
  
  // If starts with 0, replace with 94 (Sri Lanka country code)
  if (normalized.startsWith('0')) {
    normalized = '94' + normalized.substring(1);
  }
  
  // Ensure it starts with 94
  if (!normalized.startsWith('94')) {
    normalized = '94' + normalized;
  }
  
  return normalized;
}

export default factories.createCoreController('api::event-attendance.event-attendance', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        event: true,
        batchmate: true,
        markedBy: true,
      },
    };
    
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    
    ctx.query = {
      ...ctx.query,
      populate: {
        event: true,
        batchmate: true,
        markedBy: true,
      },
    };

    const response = await super.findOne(ctx);
    return response;
  },

  /**
   * Check if a batchmate exists by mobile number
   */
  async checkByMobile(ctx) {
    try {
      const { mobile } = ctx.request.body;

      if (!mobile) {
        return ctx.badRequest('Mobile number is required');
      }

      // Normalize the phone number
      const normalizedMobile = normalizePhoneNumber(mobile);

      // Search for batchmate by normalized mobile or whatsappMobile
      const batchmates = await strapi.entityService.findMany('api::batchmate.batchmate', {
        filters: {
          $or: [
            { mobile: normalizedMobile },
            { whatsappMobile: normalizedMobile },
            { mobile: mobile }, // Also try original format
            { whatsappMobile: mobile },
          ],
        },
        limit: 1,
      });

      if (batchmates && batchmates.length > 0) {
        const batchmate = batchmates[0];
        return {
          found: true,
          data: {
            id: batchmate.id,
            callingName: batchmate.callingName,
            fullName: batchmate.fullName,
            nickName: batchmate.nickName,
            address: batchmate.address,
            country: batchmate.country,
            workingPlace: batchmate.workingPlace,
            mobile: batchmate.mobile,
            whatsappMobile: batchmate.whatsappMobile,
            email: batchmate.email,
            field: batchmate.field,
          },
        };
      }

      return {
        found: false,
        message: 'You haven\'t registered earlier. Please register into the system.',
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  /**
   * Register attendance via QR code scan
   */
  async registerQRAttendance(ctx) {
    try {
      const { eventId, mobile, data } = ctx.request.body;

      if (!eventId || !mobile || !data) {
        return ctx.badRequest('Event ID, mobile number, and data are required');
      }

      // Verify event exists - eventId can be numeric id or documentId
      let event;
      try {
        // Try as numeric id or documentId
        event = await strapi.documents('api::event.event').findOne({
          documentId: eventId,
        });
      } catch (err) {
        // If that fails, try as numeric id
        try {
          event = await strapi.entityService.findOne('api::event.event', eventId);
        } catch (innerErr) {
          event = null;
        }
      }

      if (!event) {
        return ctx.notFound('Event not found');
      }

      // Normalize phone numbers
      const normalizedMobile = normalizePhoneNumber(mobile);
      const normalizedWhatsapp = data.whatsapp ? normalizePhoneNumber(data.whatsapp) : normalizedMobile;

      // Find or create batchmate
      let batchmate;
      const existingBatchmates = await strapi.entityService.findMany('api::batchmate.batchmate', {
        filters: {
          $or: [
            { mobile: normalizedMobile },
            { whatsappMobile: normalizedMobile },
            { mobile: mobile }, // Also try original format
            { whatsappMobile: mobile },
          ],
        },
        limit: 1,
      });

      if (existingBatchmates && existingBatchmates.length > 0) {
        // Update existing batchmate
        batchmate = await strapi.entityService.update('api::batchmate.batchmate', existingBatchmates[0].id, {
          data: {
            callingName: data.name || existingBatchmates[0].callingName,
            fullName: data.fullName || existingBatchmates[0].fullName,
            nickName: data.nickName || existingBatchmates[0].nickName,
            address: data.address || existingBatchmates[0].address,
            country: data.country || existingBatchmates[0].country,
            workingPlace: data.workingPlace || existingBatchmates[0].workingPlace,
            mobile: normalizedMobile,
            whatsappMobile: normalizedWhatsapp,
            email: data.email || data.gmail || existingBatchmates[0].email,
            attendance: 'Present', // Update attendance status in batchmate record
          },
        });
      } else {
        // Create new batchmate
        batchmate = await strapi.entityService.create('api::batchmate.batchmate', {
          data: {
            callingName: data.name,
            fullName: data.fullName,
            nickName: data.nickName,
            address: data.address,
            country: data.country,
            workingPlace: data.workingPlace,
            mobile: normalizedMobile,
            whatsappMobile: normalizedWhatsapp,
            email: data.email || data.gmail,
            field: data.field || 'Computer Engineering', // Default field
            attendance: 'Present', // Set attendance status
          },
        });
      }

      // Check if attendance record already exists - use event.id for relation
      const existingAttendance = await strapi.entityService.findMany('api::event-attendance.event-attendance', {
        filters: {
          event: event.id,
          batchmate: batchmate.id,
        },
        limit: 1,
      });

      let attendance;
      if (existingAttendance && existingAttendance.length > 0) {
        // Update existing attendance
        attendance = await strapi.entityService.update('api::event-attendance.event-attendance', existingAttendance[0].id, {
          data: {
            status: 'Present',
            attendanceMethod: 'QR_SCAN',
            markedAt: new Date(),
            registeredData: data,
          },
        });
      } else {
        // Create new attendance record - use event.id for relation
        attendance = await strapi.entityService.create('api::event-attendance.event-attendance', {
          data: {
            event: event.id,
            batchmate: batchmate.id,
            status: 'Present',
            attendanceMethod: 'QR_SCAN',
            markedAt: new Date(),
            registeredData: data,
          },
        });
      }

      return {
        success: true,
        message: 'Attendance registered successfully!',
        data: {
          attendance,
          batchmate,
        },
      };
    } catch (error) {
      console.error('Error registering QR attendance:', error);
      ctx.throw(500, error);
    }
  },

  /**
   * Mark attendance manually by admin
   */
  async markManualAttendance(ctx) {
    try {
      const { eventId, batchmateId, status, notes } = ctx.request.body;
      const user = ctx.state.user;

      if (!eventId || !batchmateId || !status) {
        return ctx.badRequest('Event ID, batchmate ID, and status are required');
      }

      // Verify event exists
      const event = await strapi.entityService.findOne('api::event.event', eventId);
      if (!event) {
        return ctx.notFound('Event not found');
      }

      // Verify batchmate exists
      const batchmate = await strapi.entityService.findOne('api::batchmate.batchmate', batchmateId);
      if (!batchmate) {
        return ctx.notFound('Batchmate not found');
      }

      // Check if attendance record already exists
      const existingAttendance = await strapi.entityService.findMany('api::event-attendance.event-attendance', {
        filters: {
          event: eventId,
          batchmate: batchmateId,
        },
        limit: 1,
      });

      let attendance;
      if (existingAttendance && existingAttendance.length > 0) {
        // Update existing attendance
        attendance = await strapi.entityService.update('api::event-attendance.event-attendance', existingAttendance[0].id, {
          data: {
            status,
            attendanceMethod: 'MANUAL',
            markedAt: new Date(),
            markedBy: user?.id,
            notes,
          },
        });
      } else {
        // Create new attendance record
        attendance = await strapi.entityService.create('api::event-attendance.event-attendance', {
          data: {
            event: eventId,
            batchmate: batchmateId,
            status,
            attendanceMethod: 'MANUAL',
            markedAt: new Date(),
            markedBy: user?.id,
            notes,
          },
        });
      }

      return {
        success: true,
        message: 'Attendance marked successfully!',
        data: attendance,
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  /**
   * Get all attendances for an event
   */
  async getEventAttendances(ctx) {
    try {
      const { eventId } = ctx.params;

      const attendances = await strapi.entityService.findMany('api::event-attendance.event-attendance', {
        filters: {
          event: eventId,
        },
        populate: {
          batchmate: true,
          markedBy: true,
        },
      });

      return {
        data: attendances,
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  /**
   * Bulk mark attendance for multiple batchmates
   */
  async bulkMarkAttendance(ctx) {
    try {
      const { eventId, attendances } = ctx.request.body;
      const user = ctx.state.user;

      if (!eventId || !attendances || !Array.isArray(attendances)) {
        return ctx.badRequest('Event ID and attendances array are required');
      }

      const results = [];

      for (const item of attendances) {
        const { batchmateId, status, notes } = item;

        // Check if attendance record already exists
        const existingAttendance = await strapi.entityService.findMany('api::event-attendance.event-attendance', {
          filters: {
            event: eventId,
            batchmate: batchmateId,
          },
          limit: 1,
        });

        let attendance;
        if (existingAttendance && existingAttendance.length > 0) {
          // Update existing attendance
          attendance = await strapi.entityService.update('api::event-attendance.event-attendance', existingAttendance[0].id, {
            data: {
              status,
              attendanceMethod: 'MANUAL',
              markedAt: new Date(),
              markedBy: user?.id,
              notes,
            },
          });
        } else {
          // Create new attendance record
          attendance = await strapi.entityService.create('api::event-attendance.event-attendance', {
            data: {
              event: eventId,
              batchmate: batchmateId,
              status,
              attendanceMethod: 'MANUAL',
              markedAt: new Date(),
              markedBy: user?.id,
              notes,
            },
          });
        }

        results.push(attendance);
      }

      return {
        success: true,
        message: `${results.length} attendance records updated successfully!`,
        data: results,
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}));
