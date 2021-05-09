const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport-setup');

const app = express();

app.use
(
  cookieSession
  (
    {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days is the time limit(int miliseconds)
      keys: [keys.cookieKey]  // encrypts our cookie so stored in keys.js for security issues
    }
  )
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect
(
  keys.mongoURI,
  {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true,
  }
)
.then(() => console.log('Mongoose connected ...'))
.catch(err => console.log(err));

require('./routes/authroutes')(app);
const PORT = process.env.PORT || 5000;
app.listen(PORT);


//http://localhost:5000/
