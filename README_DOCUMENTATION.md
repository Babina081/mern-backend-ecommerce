# Ecommerce Backend

Created by: Babina Gurung
Created time: July 5, 2024 11:09 PM
Tags: Engineering

# Project Preview

It is a mini CRUD development project using javascript, nodejs and mongodb associated with Ecommerce backend.

## Tools Used

1. Visual Studio
2. MongoDB Atlas
3. Postman
4. regex101
5. JSON WebToken
6. Google Chrome

## Languages

1. Javascript
2. Nodejs
3. Expressjs
4. MongoDb (NoSQL)

## Third Party Libraries

```
		"bcrypt": "^5.1.1",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-jwt": "^8.4.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.4.4",
    "morgan": "^1.10.0",
    "nodemon": "^3.1.4"
```

## Run Environment

npm start

http://localhost:3000/

## File Structure

![Untitled](Ecommerce%20Backend%20b4a28ec2ca1d4d15af43edf681b94e3c/Untitled.png)

# Connectivity

## 1. Expressjs

```jsx
const express = require("express");
const app = express();
app.get(`/`, ()=>{res.send('hello world'});
app.listen(3000, () => {
  console.log(api);
  console.log("Listening on port http://localhost:3000");
});
```

## 2. MongoDB

```jsx
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    dbName: process.env.MONGODB_DATABASE,
  })
  .then(() => {
    console.log("Database connection is ready");
  })
  .catch((err) => {
    console.log(err);
  });
```