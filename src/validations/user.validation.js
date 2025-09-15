const Joi = require('joi');
const { password } = require('./custom.validation');

const signup = {
    body: Joi.object().keys({
        displayName: Joi.string().required(),
        password: Joi.string().required().custom(password),
        username: Joi.string().required().pattern(/^[a-zA-Z0-9_]+$/).message('Username must contain only letters, numbers, and underscores without spaces'),
        email: Joi.string().email().optional(),
    }),
};

const login = {
    body: Joi.object().keys({
        username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).required(),
        password: Joi.string().required().custom(password),
    }),
};


module.exports = {
    signup,
    login,
};