require('dotenv').config();

const CONSTANT = {
    SECRET_KEY: process.env.NODE_ENV === 'production' ? 'ivs_test_key_prod_2022@' : 'ivs_test_key_dev_2022@',
    TOKEN_EXPIRE_TIME: 1440, // in minutes
    DEFAULT_PASSWORD: "IVS_DEFAULT_PASSOWRD",
    ERROR_CODE: {
        ERR_SUCCESS: 0,
        ERR_EXCEPTION: "ERR_EXCEPTION",
        ERR_INVALID_DATA_INPUT: "ERR_INVALID_DATA_INPUT",
        ERR_INVALID_TOKEN: "ERR_INVALID_TOKEN",
        ERR_INVALID_BEARER: "ERR_INVALID_BEARER",
        ERR_USER_NOT_EXIST: "ERR_USER_NOT_EXIST",
        LOGIN_FAIL: "LOGIN_FAIL",
        EMAIL_EXISTED: "EMAIL_EXISTED",
        USER_NOT_FOUND: "USER_NOT_FOUND"
    }
};

module.exports = CONSTANT;
