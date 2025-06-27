var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var recommendationsRouter = require('./routes/recommendations');
var tripsRouter = require('./routes/trips');
var adminRouter = require('./routes/admin');

var app = express();

// Enable CORS for mobile app
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/trips', tripsRouter);
app.use('/api', adminRouter);

// Serve database viewer
app.get('/db-viewer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'db-viewer.html'));
});

module.exports = app;
