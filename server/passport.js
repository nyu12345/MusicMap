require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;

module.exports = (app) => {
  //init's the app session
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.SECRET,
    })
  );

  // configure way to extract information from spotify profile
  const transformSpotifyProfile = (profile) => ({
    name: profile.display_name,
    avatar: profile.images.url,
  });

  const spotifyConfig = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  };
  
  // register spotify strategy
  passport.use(new SpotifyStrategy(spotifyConfig,
    // Gets called when user authorizes access to their profile
    async (accessToken, refreshToken, profile, done)
        // Return done callback and pass transformed user object
        => done(null, transformSpotifyProfile(profile._json))
    ));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  //init passport
  app.use(passport.initialize());
  app.use(passport.session());
}

// export const initPassport = (app) => {
//   //init's the app session
//   app.use(
//     session({
//       resave: false,
//       saveUninitialized: true,
//       secret: process.env.SECRET,
//     })
//   );
//   //init passport
//   app.use(passport.initialize());
//   app.use(passport.session());
// };