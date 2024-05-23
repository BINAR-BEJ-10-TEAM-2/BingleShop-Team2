const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { JWT_SECRET_KEY } = process.env;
const { User } = require('../models');

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_KEY,
    },
    async (payload, done) => {
      try {
        const user = await User.findByPk(payload.id);
        if (!user.is_verified) {
          return done(new Error('USER_NOT_VERIFIED_PLEASE_CONTACT_CUSTOMER_SUPPORT'), false);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

module.exports = passport;
