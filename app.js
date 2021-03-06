var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
var MySQLStore = require('express-mysql-session')(session);

var options = {
  host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  port: 3306,
  user: 'gvoch3v86kyzmy53',
  password: 'hmrcywyic6i7uni5',
  database: 'sp1hoq0zi7n09fn5'
};

var sessionStore = new MySQLStore(options);

var lab10Router = require('./public/admin/router');

var homeRouter = require('./public/router');

var app = express();

app.use(session({
  key: 'session_cookieasdfasdf_name',
  secret: 'keyboardafdsartwh435465 cat',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
// app.use('/users', usersRouter);
app.use('/home', homeRouter);


app.use('/admin', lab10Router);

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

app.listen(process.env.PORT || 3000, process.env.IP, function(){
  console.log("Express Server is Running...");
});

module.exports = app;
