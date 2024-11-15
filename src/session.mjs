import express, { request, response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";

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

app.post("/api/auth", (request, response) => {
  const { body: { username, password }, } = request;
  const findUser = mockUsers.find((user) => user.username === username);
  if(!findUser || findUser.password !== password) { 
    return response.status(401).send({ msg: "BAD CREDENTIALS" });
  }  
  request.session.user = findUser;
  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  request.sessionStore.get(request.session.id, (err, sessionData) => {
    if(err) {
      console.log(err);
      throw err;
    }
    console.log(sessionData);
  });
  return request.session.user 
    ? response.status(200).send(request.session.user) 
    : response.status(401).send({ msg: "Not Authenticated" });
});

app.post("/api/cart", (request, response) => {
  if(!request.session.user) {
    return response.sendStatus(401);
  }
  const { body: item } = request;
  const { cart } = request.session;
  if(!cart) {
    request.session.cart = [item];
  } else {
    cart.push(item);
  }
  return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
  request.sessionStore.get(request.session.id, (err, sessionData) => {
    if(err) {
      console.log(err);
      throw err;
    }
    console.log(sessionData);
  });
  if(!request.session.user) {
    return response.sendStatus(401);
  }
  return response.send(request.session.cart ?? []);
});

app.listen(PORT, () => {
    console.log(`Running on Port ${localhost}:${PORT}`);
});