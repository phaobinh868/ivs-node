const User = require('../../models/User');
const { AppError } = require('../../utils/errors');
const constant = require('../../configs/constant');
const jwt = require('../../utils/jwt');

const AuthService = module.exports;

AuthService.login = async ({email, password}) => {
    const user = await User.findOne({ email: email }).select("password");

    if (!user || user.length === 0) {
        throw new AppError(constant.ERROR_CODE.ERR_USER_NOT_EXIST);
    }
    const validPassword = user.comparePassword(password);

    if(!validPassword) throw new AppError(constant.ERROR_CODE.LOGIN_FAIL);

    const now = new Date();
    const token = jwt.sign({
        user: user,
        loginTime: now.getTime(),
        expireTIme: now.setMinutes(now.getMinutes() + constant.TOKEN_EXPIRE_TIME)
    }, constant.SECRET_KEY, constant.TOKEN_EXPIRE_TIME * 60);

    const dataReturn = {
        user: user,
        token: token
    };
    return dataReturn;
};

AuthService.register = async ({name, email, password}) => {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
        throw new AppError(constant.ERROR_CODE.EMAIL_EXISTED);
    }

    const newUserData = {
        email: email,
        name: name,
        password: password
    };
    const newUser = await User.create(newUserData);

    const dataReturn = {
        user: await User.findOne({ _id: newUser._id })
    };
    return dataReturn;
};