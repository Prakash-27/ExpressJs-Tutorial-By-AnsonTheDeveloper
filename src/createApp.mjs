import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import "./strategies/local-strategy.mjs";
// import "./strategies/discord-strategy.mjs"

export function createApp() {
    const app = express();
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

    return app;
}