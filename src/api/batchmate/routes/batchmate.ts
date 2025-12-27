/**
 * batchmate router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/batchmates',
      handler: 'api::batchmate.batchmate.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/batchmates/:id',
      handler: 'api::batchmate.batchmate.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/batchmates',
      handler: 'api::batchmate.batchmate.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/batchmates/:id',
      handler: 'api::batchmate.batchmate.update',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/batchmates/:id',
      handler: 'api::batchmate.batchmate.delete',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/batchmates/export/fieldwise',
      handler: 'api::batchmate.batchmate.exportFieldwise',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/batchmates/export/raffle-cut-sheet',
      handler: 'api::batchmate.batchmate.exportRaffleCutSheet',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
