const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      // teamId: Joi.array().items(Joi.string().custom(objectId)).optional(),
      avatar: Joi.string().allow('').optional(),
      name: Joi.string().required(),
      nickname: Joi.string().required(),
      birthDate: Joi.date().required(),
      gender: Joi.number().valid(0, 1, 2).required(), // 'male', 'female', 'other'
      phone: Joi.string().required(),
      subscribeNewsletter: Joi.boolean().allow('').optional(),
      category: Joi.array()
        .items(Joi.string().valid(...['藝術', '設計', '電影', '音樂', '科技', '出版']))
        .allow('')
        .optional(),
      contactName: Joi.string().allow('').optional(),
      commentName: Joi.string().allow('').optional(),
      contactPhone: Joi.string().allow('').optional(),
      countryCode: Joi.string().allow('').optional(),
      postalCode: Joi.string().allow('').optional(),
      city: Joi.string().allow('').optional(),
      district: Joi.string().allow('').optional(),
      address: Joi.string().allow('').optional(),
      // role: Joi.string().valid('user', 'admin'), // 根據你的角色列表進行更改
      // notifications: Joi.array().items(Joi.string().custom(objectId)),
      // collects: Joi.array().items(Joi.string().custom(objectId)),
      // isEmailVerified: Joi.boolean(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
