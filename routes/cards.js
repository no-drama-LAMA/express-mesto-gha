const router = require('express').Router();
const validator = require('validator');
const { Joi, celebrate } = require('celebrate');
const {
  getCards, createCard, deletCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards); // возвращает все карточки

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) return value;
      return helpers.message('URL указан неправильно');
    }),
  }),
}), createCard); // создаёт карточку

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deletCard); // удаляет карточку по идентификатору

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard); // поставить лайк карточке

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard); // убрать лайк с карточки

module.exports = router;
