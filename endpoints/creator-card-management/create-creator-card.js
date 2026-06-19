const { createHandler } = require('@app-core/server');
const createCreatorCard = require('@app/services/creator-card-management/create-creator-card');

module.exports = createHandler({
  path: '/creator-cards',
  method: 'post',

  async handler(rc, helpers) {
    const payload = rc.body;

    const response = await createCreatorCard(payload);

    return {
      status: helpers.http_statuses.HTTP_201_CREATED,
      message: 'Creator card created successfully',
      data: response,
    };
  },
});