var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
const bcrypt = require("bcryptjs");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dashboardRouter = require('./routes/dashboard');
var authRouter = require('./routes/auth');
var postRouter = require('./routes/posts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var salt1 = bcrypt.genSaltSync();
var salt2 = bcrypt.genSaltSync();
var secret = bcrypt.hashSync(salt1 + salt2, 10);

app.use(session({
	secret: secret, 
	resave: true,
	saveUninitialized: true,
  cookie: { secure: false } 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/auth', authRouter);
app.use('/posts', postRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
