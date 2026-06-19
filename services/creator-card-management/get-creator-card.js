const validator = require('@app-core/validator');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const CreatorCard = require('@app/repository/creator-card-management/creator-card');
const { CreatorCardMessages } = require('@app/messages');

const spec = `root {
  slug string<trim>
  access_code? string<length:6>
}`;

const parsedSpec = validator.parse(spec);

async function getCreatorCard(serviceData) {
  const data = validator.validate(serviceData, parsedSpec);

  let result;

  try {
    const card = await CreatorCard.findOne({
      query: { slug: data.slug },
    });

    if (!card || card.status === 'draft') {
      throwAppError(
        CreatorCardMessages.CARD_NOT_FOUND,
        ERROR_CODE.NOTFOUND
      );
    }

    if (card.access_type === 'private') {
      if (!data.access_code || data.access_code !== card.access_code) {
        throwAppError(
          CreatorCardMessages.PRIVATE_CARD,
          ERROR_CODE.PERMERR
        );
      }
    }

    result = card;
  } catch (error) {
    throw error;
  }

  return result;
}

module.exports = getCreatorCard;