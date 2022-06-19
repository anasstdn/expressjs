var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require("passport");
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var flash = require('express-flash');
const LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var postsRouter = require('./routes/posts'); // <-- route posts
// var postsRouterV1 = require('./routes/v1/posts'); // <-- route posts
// var loginRouter = require('./routes/v1/login');
var expressLayouts = require('express-ejs-layouts')

var app = express();

app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'cookie_user'
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxage: 100 * 60 * 60 * 24
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', './layout/main')

app.use(passport.initialize());
app.use(passport.session());
app.use(expressLayouts)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

module.exports = app;