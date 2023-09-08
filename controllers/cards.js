const BadRequestError = require('../errors/BadRequest');
const ForbiddenError = require('../errors/Forbidden');
const NotFoundError = require('../errors/NotFound');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deletCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Недьзя удалять карточки других пользователей');
      }
      return Card.deleteOne(card)
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const likes = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes } },
    { new: 'true' },
  )
    .orFail()
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const likes = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes } },
    { new: 'true' },
  )
    .orFail()
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};
