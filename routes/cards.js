const router = require('express').Router();

const {
  getCards, createCard, deletCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards); // возвращает все карточки
router.post('/', createCard); // создаёт карточку
router.delete('/:cardId', deletCard); // удаляет карточку по идентификатору
router.put('/:cardId/likes', likeCard); // поставить лайк карточке
router.delete('/:cardId/likes', dislikeCard); // убрать лайк с карточки

module.exports = router;
