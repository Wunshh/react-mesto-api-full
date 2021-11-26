const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', auth, getCurrentUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helper.message('Невалидная ссылка');
    }),
  }),
}), updateUserAvatar);

module.exports = router;
