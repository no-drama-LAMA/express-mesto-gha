const router = require('express').Router();
const validator = require('validator');
const { Joi, celebrate } = require('celebrate');
const {
  getUsers, getUserId, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers); // возвращает всех пользователей

router.get('/me', getCurrentUser); // возвращает информацию о текущем пользователе

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser); // обновляет профиль

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) return value;
      return helpers.message('URL указан неправильно');
    }),
  }),
}), updateAvatar); // обновляет аватар

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserId); // возвращает пользователя по _id

module.exports = router;
