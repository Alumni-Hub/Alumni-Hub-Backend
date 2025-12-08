/**
 * batchmate router
 */

import { factories } from '@strapi/strapi';

const defaultRouter = factories.createCoreRouter('api::batchmate.batchmate');

// Override to disable authentication
const customRouter = {
  routes: defaultRouter.routes.map((route) => {
    return {
      ...route,
      config: {
        ...route.config,
        auth: false,
      },
    };
  }),
};

export default customRouter;
