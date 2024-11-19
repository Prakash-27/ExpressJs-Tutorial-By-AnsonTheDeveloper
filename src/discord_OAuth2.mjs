import express, { request, response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
// import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs"


const app = express();

// connecting to MongoDB database.
mongoose
  .connect("mongodb://localhost/express_tutorial") 
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));   

app.use(express.json());
app.use(cookieParser("helloworld")); // we need to use cookieParser() middleware before all routes
app.use(
  session({
    secret: "anson the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })  
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
    response.sendStatus(200);
});

app.get("/api/auth/status", (request, response) => {
    console.log("Inside /auth/status endpoint");
    console.log(request.user);
    console.log(request.session);
    console.log(request.session.id);
    return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post("/api/auth/logout", (request, response) => {
    if(!request.user) return response.sendStatus(401);
    request.logout((err) => {
        if(err) {
           return response.sendStatus(400);
        } 
        response.sendStatus(200);
    });
});

// Client ID - 1307789297839116318
// Client Secret - wwR22TvYI1moByhlT-VAIRw_wj545VW0
// redirect url - http://localhost:3000/api/auth/discord/redirect

app.get("/api/auth/discord", passport.authenticate('discord'));
app.get("/api/auth/discord/redirect", passport.authenticate('discord'), 
(request, response) => {
  console.log(request.session);
  console.log(request.user); 
  response.sendStatus(200);
});

const localhost = "localhost";
const PORT = process.env.PORT || 3000;

// app.get("/", (request, response) => {
//     console.log(request.session);
//     console.log(request.session.id);
//     request.session.visited = true;
//     response.cookie("hello", "world", { maxAge: 30000, signed: true });
//     response.status(201).send({ msg: "Hello World!" });
// });

app.listen(PORT, () => {
    console.log(`Running on Port ${localhost}:${PORT}`);
});

