const { createHandler } = require('@app-core/server');
const deleteCreatorCard = require('@app/services/creator-card-management/delete-creator-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'delete',

  async handler(rc, helpers) {
    const payload = {
      slug: rc.params.slug,
    };

    const response = await deleteCreatorCard(payload);

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: 'Creator card deleted successfully',
      data: response,
    };
  },
});