/**
 * event router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/events',
      handler: 'api::event.event.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/events/:id',
      handler: 'api::event.event.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/events',
      handler: 'api::event.event.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/events/:id',
      handler: 'api::event.event.update',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/events/:id',
      handler: 'api::event.event.delete',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/events/:id/generate-qr',
      handler: 'api::event.event.generateQRCode',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/events/:id/statistics',
      handler: 'api::event.event.getStatistics',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
