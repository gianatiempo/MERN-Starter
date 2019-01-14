const JWT = require('jsonwebtoken');
const router = require('express-promise-router')();
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');

const config = require('../configuration');
const User = require('./model');
const { JWT_SECRET } = require('../configuration');

const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken', { session: false });

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({ jwtFromRequest: ExtractJwt.fromHeader('authorization'), secretOrKey: config.JWT_SECRET },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
));

// Google OAuth Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({ clientID: config.oauth.google.clientID, clientSecret: config.oauth.google.clientSecret },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Should have full user profile over here
      console.log('profile', profile);
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);

      const existingUser = await User.findOne({ "google.id": profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = new User({
        google: {
          id: profile.id,
          email: profile.emails[0].value
        }
      });

      await newUser.save();
      done(null, newUser);
    } catch (error) {
      done(error, false, error.message);
    }
  }
));

signToken = user => {
  return JWT.sign({ sub: user.id, iat: new Date().getTime(), exp: new Date().setDate(new Date().getDate() + 1) }, JWT_SECRET);
}

router.route('/oauth/google').post(passportGoogle, async (req, res, next) => {
  // Generate token
  const token = signToken(req.user);
  res.status(200).json({ token });
});

router.route('/secret').get(passportJWT, async (req, res, next) => {
  console.log('I managed to get here!');
  res.json({ secret: "resource" });
});

module.exports = router;