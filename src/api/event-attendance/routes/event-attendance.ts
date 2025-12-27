/**
 * event-attendance router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/event-attendances',
      handler: 'api::event-attendance.event-attendance.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/event-attendances/:id',
      handler: 'api::event-attendance.event-attendance.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/event-attendances/check-mobile',
      handler: 'api::event-attendance.event-attendance.checkByMobile',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/event-attendances/register-qr',
      handler: 'api::event-attendance.event-attendance.registerQRAttendance',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/event-attendances/mark-manual',
      handler: 'api::event-attendance.event-attendance.markManualAttendance',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/event-attendances/bulk-mark',
      handler: 'api::event-attendance.event-attendance.bulkMarkAttendance',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/events/:eventId/attendances',
      handler: 'api::event-attendance.event-attendance.getEventAttendances',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
