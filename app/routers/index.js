const AuthRoute = require("./auth");
const UserRoute = require("./user");
const { errorMiddleware } = require('./middleware');

module.exports = app => {
    app = AuthRoute(app);
    app = UserRoute(app);
    app.use(errorMiddleware);
    return app;
};