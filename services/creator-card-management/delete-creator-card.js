const validator = require('@app-core/validator');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const CreatorCard = require('@app/repository/creator-card-management/creator-card');
const { CreatorCardMessages } = require('@app/messages');

const spec = `root {
  slug string<trim>
}`;

const parsedSpec = validator.parse(spec);

async function deleteCreatorCard(serviceData) {
  const data = validator.validate(serviceData, parsedSpec);

  let result;

  try {
    const card = await CreatorCard.findOne({
      query: { slug: data.slug },
    });

    if (!card) {
      throwAppError(
        CreatorCardMessages.CARD_NOT_FOUND,
        ERROR_CODE.NOTFOUND
      );
    }

    await CreatorCard.deleteOne({
      query: { slug: data.slug },
    });

    result = { success: true };
  } catch (error) {
    throw error;
  }

  return result;
}

module.exports = deleteCreatorCard;