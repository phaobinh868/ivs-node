const User = require('../../models/User');
const { AppError } = require('../../utils/errors');
const constant = require('../../configs/constant');
const jwt = require('../../utils/jwt');

const userService = module.exports;

userService.getList = async ({page = 1, limit = 20}) => {
    const query = {};
    const users = await User.find(query).skip((page - 1) * limit).limit(parseInt(limit));

    const dataReturn = {
        users: users,
        total: await User.count(query)
    };
    return dataReturn;
};

userService.get = async ({id}) => {
    const user = await User.findOne({ _id: id });

    if (!user) {
        throw new AppError(constant.ERROR_CODE.USER_NOT_FOUND);
    }

    const dataReturn = {
        user: user
    };
    return dataReturn;
};

userService.edit = async (id, {email, name, password}) => {
    let user;
    const existingEmailQuery = { email: email };

    if(id){
        user = await User.findOne({ _id: id });
        if (!user) {
            throw new AppError(constant.ERROR_CODE.USER_NOT_FOUND);
        }
        existingEmailQuery._id = { $ne: id };
    } else {

        user = new User({});
    }

    const existingEmail = await User.findOne(existingEmailQuery);
    if (existingEmail) {
        throw new AppError(constant.ERROR_CODE.EMAIL_EXISTED);
    }

    user.name = name;
    user.email = email;
    if(password) user.password = password;
    await user.save();

    const dataReturn = {
        user: await User.findOne({ _id: user._id })
    };
    return dataReturn;
};