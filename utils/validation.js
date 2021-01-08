import Joi from "joi";

const joiValidate = (schema, bodyData) => {
  const JoiSchmea = Joi.object(schema);
  return JoiSchmea.validate(bodyData);
};

export const registerDataValidation = (body) => {
  return joiValidate(
    {
      username: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    },
    body
  );
};

export const loginDataValidation = (body) => {
  return joiValidate(
    {
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    },
    body
  );
};

export const profileUpdateValidation = (body) => {
  return joiValidate(
    {
      username: Joi.string().min(3),
      email: Joi.string().email(),
      password: Joi.string().min(8),
      bio: Joi.string(),
    },
    body
  );
};

export const articleCreateValidation = (body) => {
  return joiValidate(
    {
      title: Joi.string().required(),
      description: Joi.string().required(),
      body: Joi.string().required(),
      tagList: Joi.array().items(Joi.string()).min(1).required(),
    },
    body
  );
};

export const articleUpdateValidation = (body) => {
  return joiValidate(
    {
      title: Joi.string(),
      description: Joi.string(),
      body: Joi.string(),
    },
    body
  );
};

export const commentValidation = (body) => {
  return joiValidate(
    {
      body: Joi.string().trim().min(1).required(),
    },
    body
  );
};
