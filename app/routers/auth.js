const express = require('express');
const apis = require("../configs/apis");
const AuthService = require('../services/auth/AuthService');
const Joi = require('joi');

const {
    validationMiddleware,
    handlerMiddleware
} = require('./middleware');

module.exports = app => {
    const api = express.Router();

    api.post(
        apis.AUTH.LOGIN, 
        validationMiddleware({
            body: {
                email: Joi.string().required().email(),
                password: Joi.string().required()
            },
        }),
        handlerMiddleware(async req => {
            return AuthService.login(req.body);
        })
    );

    api.post(
        apis.AUTH.REGISTER,
        validationMiddleware({
            body: {
                name: Joi.string().required(),
                email: Joi.string().required().email(),
                password: Joi.string().required()
            },
        }),
        handlerMiddleware(async req => {
            return AuthService.register(req.body);
        })
    );
    
    app.use('/auth', api);
    return app;
};