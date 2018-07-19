const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const passport = require('passport');
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLEURL
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  User.findOne({
      googleID: profile.id
      })
      .then(user => {
        console.log(user)
          if (user) {
              User.findByIdAndUpdate(user._id,{
                  username:profile.displayName},{new:true}).then(user => {
                      return done(null, user);
                  })
          }

          const newUser = new User({
              username: profile.displayName,
              googleID: profile.id
          });

          newUser.save()
              .then(user => {
                  done(null, newUser);
              })
      })
      .catch(error => {
          done(error)
      })

}));

