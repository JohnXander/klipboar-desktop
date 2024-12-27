import { Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import User from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in the environment variables.');
}

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

export const bearerStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);

    if (user) {
      return done(null, user);
    }

    return done(null, false);
  } catch (err) {
      console.error(err);
      return done(err, false);
  }
})
