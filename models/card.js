const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: { // имя карточки
    type: String, // имя — это строка
    required: [true, 'Заполните это поле.'], // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: [2, 'Текст должен быть не короче 2 симв.'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Текст должен быть не длиннее 30 симв.'], // а максимальная — 30 символов
  },
  link: { // ссылка на картинку
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'URL указан неправильно',
    },
  },
  owner: { // ссылка на модель автора карточки
    type: mongoose.Schema.Types.ObjectId, // тип ObjectId
    required: true, // обязательное поле
    ref: 'user',
  },
  likes: [ // список лайкнувших пост пользователей
    {
      type: mongoose.Schema.Types.ObjectId, // это строка
      ref: 'user',
    },
  ],
  createdAt: { // дата создания
    type: Date, // это дата
    default: Date.now, // обязательное поле
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
