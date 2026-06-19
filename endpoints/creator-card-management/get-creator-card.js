const { createHandler } = require('@app-core/server');
const getCreatorCard = require('@app/services/creator-card-management/get-creator-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'get',

  async handler(rc, helpers) {
    const payload = {
      slug: rc.params.slug,
      access_code: rc.query.access_code,
    };

    const response = await getCreatorCard(payload);

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: 'Creator card fetched successfully',
      data: response,
    };
  },
});