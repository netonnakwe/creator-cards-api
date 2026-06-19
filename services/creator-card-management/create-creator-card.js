const validator = require('@app-core/validator');
const { ulid } = require('@app-core/randomness');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { appLogger } = require('@app-core/logger');

const CreatorCard = require('@app/repository/creator-card-management/creator-card');
const { CreatorCardMessages } = require('@app/messages');

const spec = `root {
  title string<trim|minLength:3|maxLength:100>
  description string<trim|maxLength:500>
  slug string<minLength:5|maxLength:50>
  creator_reference string<length:20>
  links[] {
    title string<trim|minLength:1|maxLength:100>
    url string<trim|maxLength:200>
  }
  service_rates? {
    currency string(NGN|USD|GBP|GHS)
    rates[] {
      name string<trim|minLength:3|maxLength:100>
      description string<trim|maxLength:250>
      amount number<min:1>
    }
  }
  status string(draft|published)
  access_type? string(public|private)
  access_code? string<length:6>
}`;

const parsedSpec = validator.parse(spec);

async function createCreatorCard(serviceData, options = {}) {
  const data = validator.validate(serviceData, parsedSpec);

  let result;

  try {
    const existing = await CreatorCard.findOne({
      query: { slug: data.slug },
    });

    if (existing) {
      throwAppError(CreatorCardMessages.SLUG_EXISTS, ERROR_CODE.DUPLRCRD);
    }

    const accessType = data.access_type || 'public';

    if (accessType === 'private' && !data.access_code) {
      throwAppError(
        'Access code required for private card',
        ERROR_CODE.INVLDDATA
      );
    }

    if (accessType !== 'private' && data.access_code) {
      throwAppError(
        'Access code not allowed for public card',
        ERROR_CODE.INVLDDATA
      );
    }

    const card = await CreatorCard.create({
      _id: ulid(),
      ...data,
      access_type: accessType,
    });

    result = {
      id: card._id,
      slug: card.slug,
      title: card.title,
    };
  } catch (error) {
    appLogger.errorX(error, 'create-creator-card-error');
    throw error;
  }

  return result;
}

module.exports = createCreatorCard;