import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    // Register custom user management routes
    strapi.server.routes([
      {
        method: 'GET',
        path: '/api/health',
        handler: async (ctx: any) => {
          ctx.body = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            service: 'alumni-hub-backend',
          };
        },
        config: {
          auth: false,
        },
      },
      {
        method: 'GET',
        path: '/api/user-management/all',
        handler: async (ctx: any) => {
          try {
            const users = await strapi.query('plugin::users-permissions.user').findMany({
              populate: ['role'],
            });
            ctx.body = users.map((user: any) => ({
              id: user.id,
              username: user.username,
              email: user.email,
              provider: user.provider,
              confirmed: user.confirmed,
              blocked: user.blocked,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              role: user.role ? {
                id: user.role.id,
                name: user.role.name,
                type: user.role.type,
              } : null,
            }));
          } catch (err) {
            ctx.throw(500, err);
          }
        },
        config: {
          auth: false,
        },
      },
      {
        method: 'GET',
        path: '/api/user-management/roles',
        handler: async (ctx: any) => {
          try {
            const roles = await strapi.query('plugin::users-permissions.role').findMany();
            ctx.body = roles.map((role: any) => ({
              id: role.id,
              name: role.name,
              description: role.description,
              type: role.type,
            }));
          } catch (err) {
            ctx.throw(500, err);
          }
        },
        config: {
          auth: false,
        },
      },
      {
        method: 'GET',
        path: '/api/user-management/:id',
        handler: async (ctx: any) => {
          const { id } = ctx.params;
          try {
            const user = await strapi.query('plugin::users-permissions.user').findOne({
              where: { id },
              populate: ['role'],
            });
            if (!user) {
              return ctx.notFound('User not found');
            }
            ctx.body = {
              id: user.id,
              username: user.username,
              email: user.email,
              provider: user.provider,
              confirmed: user.confirmed,
              blocked: user.blocked,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              role: user.role ? {
                id: user.role.id,
                name: user.role.name,
                type: user.role.type,
              } : null,
            };
          } catch (err) {
            ctx.throw(500, err);
          }
        },
        config: {
          auth: false,
        },
      },
      {
        method: 'POST',
        path: '/api/user-management/create',
        handler: async (ctx: any) => {
          const { username, email, password, role, confirmed, blocked } = ctx.request.body;
          try {
            if (!username || !email || !password) {
              return ctx.badRequest('Username, email, and password are required');
            }
            const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
              where: { email },
            });
            if (existingUser) {
              return ctx.badRequest('Email already in use');
            }
            const newUser = await strapi.query('plugin::users-permissions.user').create({
              data: {
                username,
                email,
                password,
                role: role || undefined,
                confirmed: confirmed !== undefined ? confirmed : true,
                blocked: blocked !== undefined ? blocked : false,
                provider: 'local',
              },
              populate: ['role'],
            });
            ctx.body = {
              id: newUser.id,
              username: newUser.username,
              email: newUser.email,
              provider: newUser.provider,
              confirmed: newUser.confirmed,
              blocked: newUser.blocked,
              createdAt: newUser.createdAt,
              updatedAt: newUser.updatedAt,
              role: newUser.role ? {
                id: newUser.role.id,
                name: newUser.role.name,
                type: newUser.role.type,
              } : null,
            };
          } catch (err) {
            ctx.throw(500, err);
          }
        },
        config: {
          auth: false,
        },
      },
      {
        method: 'PUT',
        path: '/api/user-management/update/:id',
        handler: async (ctx: any) => {
          const { id } = ctx.params;
          const { username, email, role, confirmed, blocked } = ctx.request.body;
          try {
            const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
              where: { id },
            });
            if (!existingUser) {
              return ctx.notFound('User not found');
            }
            const updatedUser = await strapi.query('plugin::users-permissions.user').update({
              where: { id },
              data: {
                username: username !== undefined ? username : existingUser.username,
                email: email !== undefined ? email : existingUser.email,
                role: role !== undefined ? role : existingUser.role,
                confirmed: confirmed !== undefined ? confirmed : existingUser.confirmed,
                blocked: blocked !== undefined ? blocked : existingUser.blocked,
              },
              populate: ['role'],
            });
            ctx.body = {
              id: updatedUser.id,
              username: updatedUser.username,
              email: updatedUser.email,
              provider: updatedUser.provider,
              confirmed: updatedUser.confirmed,
              blocked: updatedUser.blocked,
              createdAt: updatedUser.createdAt,
              updatedAt: updatedUser.updatedAt,
              role: updatedUser.role ? {
                id: updatedUser.role.id,
                name: updatedUser.role.name,
                type: updatedUser.role.type,
              } : null,
            };
          } catch (err) {
            ctx.throw(500, err);
          }
        },
        config: {
          auth: false,
        },
      },
      {
        method: 'DELETE',
        path: '/api/user-management/delete/:id',
        handler: async (ctx: any) => {
          const { id } = ctx.params;
          try {
            const user = await strapi.query('plugin::users-permissions.user').findOne({
              where: { id },
            });
            if (!user) {
              return ctx.notFound('User not found');
            }
            await strapi.query('plugin::users-permissions.user').delete({
              where: { id },
            });
            ctx.body = { message: 'User deleted successfully' };
          } catch (err) {
            ctx.throw(500, err);
          }
        },
        config: {
          auth: false,
        },
      },
    ]);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
