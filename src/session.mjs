import express, { request, response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

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
  })  
);
app.use(routes);

const localhost = "localhost";
const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    request.session.visited = true;
    response.cookie("hello", "world", { maxAge: 30000, signed: true });
    response.status(201).send({ msg: "Hello World!" });
});

app.listen(PORT, () => {
    console.log(`Running on Port ${localhost}:${PORT}`);
});