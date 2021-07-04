import * as Joi from '@hapi/joi';

// This validates the config module schema
// i.e if any of the below mentioned fields are not present as environment variables, nestJS would throw specific errors
export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(8080),
  STAGE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
