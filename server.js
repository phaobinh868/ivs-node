const express = require("express");
const cors = require("cors");
const routers = require("./app/routers");
const AWSXRay = require('aws-xray-sdk');
const db = require('./app/db');
require('dotenv').config();
const fs = require('fs');

const main = async () => {
    db.init();
    
    let app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use(AWSXRay.express.openSegment(process.env.SERVICE_NAME || 'backend'));
    app = routers(app);
    app.get('*', (req, res) => {
      const url = req.url.split("?");
      if (fs.existsSync(__dirname + '/app/public' + url[0])) {
          return res.sendFile(__dirname + '/app/public' + url[0]);
      }
      return res.sendFile(__dirname + '/app/public/index.html');
    });
    app.use(AWSXRay.express.closeSegment());
    
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}.`);
    });
};

main();