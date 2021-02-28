const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO DB CONNECTED");
  })
  .catch((e) => {
    console.log(e);
  });

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users/users');

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      mongooseConnection: mongoose.connection,
      autoReconnect: true,
    }),
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

app.use((req, res, next) => {
  res.locals.error = null;
  res.locals.success = null;
  res.locals.data = null;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;