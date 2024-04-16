import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from 'dotenv';
import User from './models/User.mjs';

// Load Environment Variables
dotenv.config();

// JWT Options
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

// JWT Strategy
passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user); // User found
        } else {
            return done(null, false); // User not found
        }
    } catch (error) {
        return done(error, false); // SQLite error
    }
}));

export default passport;