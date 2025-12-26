/**
 * notification router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/notifications',
      handler: 'api::notification.notification.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/notifications/:id',
      handler: 'api::notification.notification.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/notifications',
      handler: 'api::notification.notification.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/notifications/:id',
      handler: 'api::notification.notification.update',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/notifications/:id',
      handler: 'api::notification.notification.delete',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
