const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const router1 = require("./routes/candidates");
const router2 = require("./routes/clients");
const router3 = require("./routes/callSchedule");
const router4=require("./routes/dynamic");
const router5=require("./routes/sap");
const { startTokenRefreshing } = require("./accessToken");
const port = process.env.PORT || 4000;
const helmet = require('helmet');
const compression = require('compression');
const { allowCrossDomain } = require('./middlewares/cors/core.middleware');
const {connection}=require("./mongoDb/connection");
const {getSharedObjSharedObj, getSharedObj}=require("./shared.js");
app.use(cors());
app.use("/api/", router1);
app.use("/apiclient/",router2);
app.use("/apicall/",router3);
app.use("/apideveloper/",router4);
app.use("/apisap/",router5);
app.use(helmet());
app.use(compression());
app.use(allowCrossDomain);

connection().then((resolve)=>{
  console.log(resolve);
  app.listen(port,async() => {
    console.log(`Server up and running on ${process.env.NODE_ENV} environment with port ${port} !`);
    startTokenRefreshing();
  });
}).catch((error)=>{
  console.log(error);
});





