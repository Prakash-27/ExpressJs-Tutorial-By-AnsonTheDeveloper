import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log(`Inside Deserializer`);
    console.log(`Deserializing User ID: ${id}`);
    try {
      // Using Database:
      // using async keyword at arrow function
      const findUser = await DiscordUser.findById(id);
      if(!findUser) throw new Error("User Not Found");
      done(null, findUser);

      // Using Array:
      // const findUser = mockUsers.find((user) => user.id === id);
      // if(!findUser) throw new Error("User Not Found");  
      // done(null, findUser);
    } catch (err) {
      done(err, null);  
    }
})

export default passport.use(
    new Strategy(
        {
          clientID: "1307789297839116318",
          clientSecret: "wwR22TvYI1moByhlT-VAIRw_wj545VW0",
          callbackURL: "http://localhost:3000/api/auth/discord/redirect",
          scope: ["identify", "guilds", "email"],
        }, 
        async (accessToken, refreshToken, profile, done) => {
          // console.log(profile);

          let findUser;
          try {
            findUser = await DiscordUser.findOne({ discordId: profile.id });
          } catch (err) {
            return done(err, null);
          }

          try {
            if(!findUser) {
              const newUser = new DiscordUser({
                  username: profile.username,
                  discordId: profile.id,
              });
              const newSavedUser = await newUser.save();
              return done(null, newSavedUser);
            }
            return done(null, findUser);
          } catch (err) {
            console.log(err);
            return done(err, null);
          }
        }
    )
);