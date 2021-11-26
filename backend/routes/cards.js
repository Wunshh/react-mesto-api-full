const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const validator = require('validator');

const {
  getCards,
  createCards,
  likeCard,
  dislikeCard,
  deleteCards,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helper.message('Невалидная ссылка');
    }),
  }),
}), createCards);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCards);

module.exports = router;
