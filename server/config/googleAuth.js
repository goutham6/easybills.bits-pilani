const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // IMPORTANT: use env var so it matches EXACTLY what is configured in Google Cloud Console
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile?.emails?.[0]?.value;

        // Enforce BITS Email Only
        if (
          !email ||
          !/(pilani|goa|hyderabad|dubai|wilp)\.bits-pilani\.ac\.in$/.test(email)
        ) {
          return done(null, false, { message: "Not a BITS institutional email" });
        }

        let user = await User.findOne({ email });

        if (!user) {
          // Auto-create user
          user = await User.create({
            name: profile.displayName,
            email,
            role: "faculty", // default role
            password: "GOOGLE_LOGIN",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;