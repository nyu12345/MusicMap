const session = require("express-session");
const cookieparser = require("cookie-parser");
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const User = require("server/models/userSchema");
const Membership = require("server/models/membershipSchema");

// export a function that receives the Express app we will configure for Passport
module.exports = (app) => {
  // middlewares used to make passport work with sessions (keep user logged in until he/she logs out)
  app.use(cookieparser());
  app.use(
    session({
      secret: "keyboard cat", // should be changed to something cryptographically secure for production
      resave: false,
      saveUninitialized: false,
      // automatically extends the session age on each request. useful if you want
      // the user's activity to extend their session. If you want an absolute session
      // expiration, set to false
      rolling: true,
      name: "sid", // don't use the default session cookie name
      cookie: {
        httpOnly: false, // default is set to true - experiment with this
        // the duration in milliseconds that the cookie is valid
        maxAge: 20 * 60 * 1000, // 20 minutes
        // recommended you use this setting in production if you have a well-known domain you want to restrict the cookies to.
        // domain: 'your.domain.com',
        // recommended you use this setting in production if your site is published using HTTPS
        // secure: true,
      },
    })
  );

  // save user data in session cookie by serializing user ID
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // configure way to turn serialized user ID in session cookie back to actual User record from Mongo
  // (find the user with matching ID and return)
  // User record will be available on each authenticated request via the req.user property
  passport.deserializeUser(function (userId, done) {
    User.findById(userId)
      .then(function (user) {
        done(null, user);
      })
      .catch(function (err) {
        done(err);
      });
  });

  // in this case, we tell it how to find a User that has a socialMedia entry
  // of type "spotify" that has the same profile ID of the spotify account
  // they used to log in.
  passport.use(
    new SpotifyStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        // the path spotify will call back to once the user has logged in.
        // We'll define this route in routes/htmlRoutes.js
        callbackURL: `${process.env.APP_BASE_URL}/auth/spotify/callback`,
        // for scopes see: https://developer.spotify.com/web-api/using-scopes/
        scope: [
          "user-read-private",
          "user-read-email",
          "playlist-read-private",
          "playlist-read-collaborative",
          "user-follow-read",
          "user-read-currently-playing",
          "user-top-read",
        ],
      },

      async (accessToken, refreshToken, expires_in, profile, done) => {
        let user;
        let membership;

        try {
          // if membership exists, update access token (which will periodically expire)
          membership = await Membership.findOneAndUpdate(
            {
              spotifyId: profile.id,
            },
            {
              // TODO: encrypt the following tokens!
              accessToken,
              refreshToken,
            }
          ).populate("userId");
        } catch (err) {
          return done(err, null);
        }

        if (!membership) {
          try {
            // no user with this spotify account is on file,
            // so create a new user and membership for this spotify user
            user = await User.create({
              name: profile.displayName,
              spotifyUsername: profile.username,
            });
            membership = await Membership.create({
              spotifyId: profile.id,
              accessToken,
              refreshToken,
              userId: user.id,
            });
          } catch (err) {
            return done(err, null);
          }
        } else {
          // get the user from the membership
          user = membership.userId;
        }

        // found user
        done(null, user);
      }
    )
  );

  app.use(passport.initialize());

  // serialize/deserialize user from session cookie & add to req.user
  app.use(passport.session());
};
