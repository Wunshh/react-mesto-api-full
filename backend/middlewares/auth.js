const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthenticationFailedError = require('../errors/AuthenticationFailedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthenticationFailedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'Not-so-secret');
  } catch (err) {
    next(new AuthenticationFailedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};

module.exports = auth;
