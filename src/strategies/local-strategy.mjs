import passport from "passport";
import { Strategy } from "passport-local"; 
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

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
      const findUser = await User.findById(id);
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
    new Strategy(async (username, password, done) => {
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        try {
          // Using Database:
          // using async keyword at arrow function
          const findUser = await User.findOne({ username: username });
          if(!findUser) throw new Error("User not found");
          // if(findUser.password !== password) throw new Error("Invalid Credentials");
          // comparing plain password in request body with hashed password with database
          if(!comparePassword(password, findUser.password)) throw new Error("Invalid Credentials");
          done(null, findUser);
          
          // Using Array:
          // const findUser = mockUsers.find((user) => user.username === username);
          // if(!findUser) throw new Error("User not found");
          // if(findUser.password !== password) throw Error("Invalid Credentials");
          // done(null, findUser);
        } catch (err) {
          done(err, null);  
        }
    })
);

// export default passport.use(
//     new Strategy({ usernameField: "email" }, (username, password, done) => {
//         console.log(`Username: ${username}`);
//         console.log(`Password: ${password}`);
//         try {
//           const findUser = mockUsers.find((user) => user.username === username);
//           if(!findUser) throw new Error("User not found");
//           if(findUser.password !== password) throw Error("Invalid Credentials");
//           done(null, findUser);
//         } catch (err) {
//           done(err, null);  
//         }
//     })
// );

// we need to send post request as email in api/auth endpoint.
// {
//     "email": "anson@gmail.com",
//     "password": "hello123"
// }