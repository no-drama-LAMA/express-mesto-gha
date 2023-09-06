const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/users');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) return value;
      return helpers.message('URL указан неправильно');
    }),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }).unknown(true),
}), createUser);

module.exports = router;
