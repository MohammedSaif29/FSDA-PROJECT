import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './config.js';
import { createUser, findUserByEmail, findUserById, updateUser } from './models/User.js';

const getRoleForEmail = (email) => (
  config.adminEmails.includes(email.toLowerCase()) ? 'ADMIN' : 'STUDENT'
);

export function configurePassport(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findUserById(id);
      done(null, user || false);
    } catch (error) {
      done(error);
    }
  });

  if (!config.google.clientId || !config.google.clientSecret) {
    return;
  }

  passport.use(new GoogleStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackUrl,
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase();

      if (!email) {
        return done(new Error('Google account did not provide an email address.'));
      }

      let user = await findUserByEmail(email);

      if (!user) {
        user = await createUser({
          username: profile.displayName || email.split('@')[0],
          email,
          role: getRoleForEmail(email),
          authProvider: 'GOOGLE',
          googleId: profile.id,
          avatarUrl: profile.photos?.[0]?.value || '',
          fullName: profile.displayName || '',
          isEmailVerified: true,
        });
      } else {
        user = await updateUser(user.id, {
          googleId: profile.id,
          authProvider: 'GOOGLE',
          avatarUrl: profile.photos?.[0]?.value || user.avatarUrl,
          fullName: profile.displayName || user.fullName,
          isEmailVerified: true,
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}
