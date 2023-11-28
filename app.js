const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const app = express();

app.use(bodyParser.json());

app.use(session({
    secret: 'your-secret-key', // Change this to a random secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Change to true if using https
  }));

const accountRoute = require('./routes/account');
const adminRoute = require('./routes/admin');
const peminjamRoute = require('./routes/peminjam');

const corsOptions = {
    credentials: true, 
    origin: "http://localhost:3001"
};

app.use(cors(corsOptions));
app.use("/account",accountRoute);
app.use("/admin",adminRoute);
app.use("/user",peminjamRoute);
app.use("/uploads", express.static('uploads'));

module.exports = app;