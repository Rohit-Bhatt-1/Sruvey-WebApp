const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) =>
{
  done(null, user.id);
});

passport.deserializeUser((id, done) =>
  {
    User.findById(id)
      .then(user =>
      {
        done(null, user);
      }
    );
  }
);

passport.use(
  new GoogleStrategy
  (
    {
      clientID : keys.googleClientID,
      clientSecret : keys.googleClientSecret,
      callbackURL : '/auth/google/callback',
      //passReqToCallback : true,
      proxy : true
    },
    (acessToken, refreshToken, profile, done) =>
    {
        //console.log(profile);
        User.findOne({ googleID : profile.id})
          .then(
            (existingUser) =>
            {
              if(existingUser)
              {
                //there is already a user with this emailin our adatbase
                console.log('User already exists!');
                done(null, existingUser);
              }
              else
              {
                //NEW User
                console.log('New User!\n');
                new User({ googleID : profile.id}).save()
                .then
                  (
                     user => done(null, user)
                  );
              }
            }
        );
    }
  )
);
