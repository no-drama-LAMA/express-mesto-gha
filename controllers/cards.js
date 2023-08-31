const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deletCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Карточка не найдена' });
          return;
        }
        res.send({ message: 'Карточка удалена' });
      })
      .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
};

module.exports.likeCard = (req, res) => {
  const likes = req.user._id;
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes } },
      { new: 'true' },
    )
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Карточка не найдена' });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
};

module.exports.dislikeCard = (req, res) => {
  const likes = req.user._id;
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes } },
      { new: 'true' },
    )
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Карточка не найдена' });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
};
