let jwt = require('jsonwebtoken');

const myJwt = {};

myJwt.sign = (data, SECRET_KEY, EXPIRED_TIME) => {
    try {
        if (EXPIRED_TIME) {
            return jwt.sign(data, SECRET_KEY, { expiresIn: EXPIRED_TIME });
        }
        return jwt.sign(data, SECRET_KEY);
    } catch (e) {
        return false;
    }
}

myJwt.unSign = (token, SECRET_KEY) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (e) {
        return false;
    }
} 

module.exports = myJwt;