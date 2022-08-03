const mongoose = require('mongoose');
require('dotenv').config();
const db = {};

db.stop = async () => {
    await mongoose.disconnect();
};

const connectWithRetry = function () {
    try {
        const dbHost = process.env.DB_HOST || 'db';
        const dbPort = process.env.DB_PORT || 27017;
        const dbName = process.env.DB_NAME || 'ivs_db';
        const stringConnection = `mongodb://${dbHost}:${dbPort}/${dbName}`;
        return mongoose.connect(stringConnection, { useNewUrlParser: true, useFindAndModify: false }, (err) => {
            if (err) {
                setTimeout(connectWithRetry, 5000)
            }
        })
    } catch (error) {
        setTimeout(connectWithRetry, 5000)
    }
}

db.init = () => {
    connectWithRetry();
};

module.exports = db;
