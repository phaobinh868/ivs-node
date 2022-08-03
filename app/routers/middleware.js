const assert = require('assert-plus');
const constant = require('../configs/constant');
const jwt = require('../utils/jwt');
const { AppError } = require('../utils/errors');
const Joi = require('joi');

const checkTokenAuth = async (req, res, next) => {
    try {
        const bearerHeader = req.headers.authorization;
        assert.string(bearerHeader, 'bearerHeader');

        const bearer = bearerHeader.split(' ');
        if (bearer < 2) {
            throw new Error(constant.ERROR_CODE.ERR_INVALID_BEARER);
        }
        const bearerToken = bearer[bearer.length - 1];
        const user = jwt.unSign(bearerToken, constant.SECRET_KEY);

        assert.object(user, 'user');
        req.user = user;
        next();
    } catch (error) {
        next(new AppError(constant.ERROR_CODE.ERR_INVALID_TOKEN, {}, error.stack));
    }
};

const validationMiddleware = schema => {
    return async (req, res, next) => {
        try {
            if (schema.query) {
                req.query = await Joi.object(schema.query)
                    .options({ stripUnknown: true })
                    .validateAsync(req.query);
            }
            if (schema.body) {
                req.body = await Joi.object(schema.body)
                    .options({ stripUnknown: true })
                    .validateAsync(req.body);
            }
            if (schema.params) {
                req.params = await Joi.object(schema.params)
                    .options({ stripUnknown: true })
                    .validateAsync(req.params);
            }
        } catch (error) {
            return next(
                new AppError(constant.ERROR_CODE.ERR_INVALID_DATA_INPUT, {}, error.stack),
            );
        }

        return next();
    };
};

const handlerMiddleware = (handler) => {
    return async (req, res, next) => {
        try {
            const data = await handler(req, res, next);
            const response = { status: constant.ERROR_CODE.ERR_SUCCESS, data };
            res.json(response);
        } catch (error) {
            next(error);
        }
    };
};

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.json({ status: err.status, data: err.data, message: err.message });
    }
    console.log(err);
    return res.status(500).json({ status: constant.ERROR_CODE.ERR_EXCEPTION, data: {}, message: err.stack || err });
};

module.exports = {
    checkTokenAuth,
    validationMiddleware, 
    handlerMiddleware,
    errorMiddleware
};
