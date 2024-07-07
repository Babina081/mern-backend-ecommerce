const express = require("express");
const app = express();
//for parsing json
const bodyParser = require("body-parser");
//log http request (get, post, delete,put,patch)
const morgan = require("morgan");

//mongoose help to talk with the mongodb database
//it is wrapper of the mongodb
const mongoose = require("mongoose");

// for authentication of token and authorization created a separate file called helpers
const authJwt = require("./helpers/jwt");

// importing errorHandler
const errorHandler = require("./helpers/error-handler");

//for cors
const cors = require("cors");

require("dotenv/config.js");
const api = process.env.API_URL;

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

//allow passing all the http in any other origin
app.use(cors());
app.options("*", cors());

//for authentication
app.use(authJwt());

app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//handling error
app.use(errorHandler);

//imported
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const categoriesRoutes = require("./routes/categories");
const ordersRoutes = require("./routes/orders");

//routes
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/orders`, ordersRoutes);

//connecting to mongodb
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    // depreicated
    // useUnifiedTopology: true,
    // useNewUrlParser: true,
    dbName: process.env.MONGODB_DATABASE,
  })
  .then(() => {
    console.log("Database connection is ready");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log(api);
  console.log("Listening on port http://localhost:3000");
});
