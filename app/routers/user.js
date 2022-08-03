const express = require('express');
const apis = require("../configs/apis");
const Joi = require('joi');

const { 
    checkTokenAuth,
    validationMiddleware,
    handlerMiddleware
} = require('./middleware');
const UserService = require('../services/user/UserService');

module.exports = app => {
    const api = express.Router();

    api.get(
        apis.USER.LIST, 
        handlerMiddleware(async req => {
            return UserService.getList(req.query);
        })
    );
    
    api.get(
        apis.USER.GET, 
        validationMiddleware({
            params: {
                id: Joi.string().required()
            },
        }),
        handlerMiddleware(async req => {
            return UserService.get(req.params);
        }),
    );

    api.post(
        apis.USER.CREATE,
        validationMiddleware({
            body: {
                name: Joi.string().required(),
                email: Joi.string().required().email(),
                password: Joi.string().required()
            },
        }),
        handlerMiddleware(async req => {
            return UserService.edit(undefined, req.body);
        }),
    );

    api.post(
        apis.USER.EDIT,
        validationMiddleware({
            params: {
                id: Joi.string().required()
            },
            body: {
                name: Joi.string().required(),
                email: Joi.string().required().email()
            },
        }),
        handlerMiddleware(async req => {
            return UserService.edit(req.params.id, req.body);
        }),
    );

    app.use('/users', checkTokenAuth, api);
    return app;
};