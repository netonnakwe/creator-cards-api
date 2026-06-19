const { ModelSchema, SchemaTypes, DatabaseModel } = require('@app-core/mongoose');
const timestamps = require('./plugins/timestamps');

const modelName = 'creator_cards';

const schemaConfig = {
  _id: { type: SchemaTypes.ULID },

  title: { type: SchemaTypes.String },
  description: { type: SchemaTypes.String },

  slug: { type: SchemaTypes.String, unique: true, index: true },

  creator_reference: { type: SchemaTypes.String, index: true },

  links: { type: SchemaTypes.Any },

  service_rates: { type: SchemaTypes.Any },

  status: { type: SchemaTypes.String, index: true },

  access_type: { type: SchemaTypes.String, index: true },

  access_code: { type: SchemaTypes.String },
};

const modelSchema = new ModelSchema(schemaConfig, { collection: modelName });

modelSchema.plugin(timestamps);

module.exports = DatabaseModel.model(modelName, modelSchema, { paranoid: true });