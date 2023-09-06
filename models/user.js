const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const UnauthorizedError = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Текст должен быть не короче 2 симв.'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Текст должен быть не длиннее 30 симв.'], // а максимальная — 30 символов
  },
  about: { // информация о пользователе
    type: String, // это строка
    default: 'Исследователь',
    minlength: [2, 'Текст должен быть не короче 2 симв.'], // минимальная длина — 2 символа
    maxlength: [30, 'Текст должен быть не длиннее 30 симв.'], // а максимальная — 30 символов
  },
  avatar: { // аватар
    type: String, // это строка
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'URL указан неправильно',
    },
  },
  email: { // email
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Адрес электронной почты указан неправильно',
    },
  },
  password: { // пароль
    type: String, // это строка
    required: [true, 'Заполните это поле.'], // обязательное поле
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
