import express, { request, response } from "express";
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs"

const app = express();

app.use(express.json());

const resolveIndexByUserId = (request, response, next) => {
    const { params: { id }, } = request;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) {
        return response.sendStatus(400);
    }  
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) {
        return response.sendStatus(404);
    }
    request.findUserIndex = findUserIndex;
    next();
}

const localhost = "localhost";
const PORT = process.env.PORT || 3000;

const mockUsers = [
    { id: 1, username: "anson", displayName: "Anson" },
    { id: 2, username: "jack", displayName: "Jack" },
    { id: 3, username: "adam", displayName: "Adam" },
    { id: 4, username: "tina", displayName: "Tina" },
    { id: 5, username: "jason", displayName: "Jason" },
    { id: 6, username: "henry", displayName: "Henry" },
    { id: 7, username: "marilyn", displayName: "Marilyn" },
];

app.get("/", (request, response) => {
        response.status(201).send({ msg: "Hello World!" });
});

app.get("/api/products", (request, response) => {
    response.send([
        {id: 123, name: "chicken breast", price: 12.99},
    ]);
});

// app.get("/api/users", (request, response) => {
//     response.send(mockUsers);
// });

// GET
// Route parameter (localhost:3000/api/users/id)
app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
    if(!findUser) {
        return response.sendStatus(404); // Not Found
    } else {
        return response.send(findUser);
    }
});

// Query parameter (localhost:3000/users?key=value&key2=value2)
// (localhost:3000/api/users?filter=anson)
// (localhost:3000/api/users?filter=username)
// (localhost:3000/api/users?filter=username&value=an)
// (localhost:3000/api/users?filter=displayName&value=e)
// (localhost:3000/api/users?filter=displayName&value=a)
app.get(
    "/api/users", 
    query("filter") // Query parameter validator
      .isString()
      .notEmpty()
      .withMessage("Must not be empty")
      .isLength({ min: 3, max: 10 })
      .withMessage("Must be at least 3-10 characters"), 
    (request, response) => {
      console.log(request.query);
      const result = validationResult(request); // validationResult will produce the result of validation, this will throw error in console when the query parameter doesn't meet the condition. 
      console.log(result);
      const { query: { filter, value }, } = request;
      // when filter and value are undefined
      // if(!filter && !value) return response.send(mockUsers);
      response.send(mockUsers);
      if(filter && value) return response.send(
          mockUsers.filter((user) => user[filter].includes(value))
      );
    }
);

// POST
app.post(
    "/api/users",
    // [
    //   body("username") // body() is a request body in that validate a specific field like id, username, displayName etc.
    //     .notEmpty()
    //     .withMessage("username cannot be emmpty")
    //     .isLength({ min: 5, max: 32 })
    //     .withMessage("username must be at least 5 characters with a max of 32 characters")
    //     .isString()
    //     .withMessage("username must be a string!"),
    //   body("displayName")
    //     .notEmpty()
    //     .withMessage('displayName cannot be emmpty'),   
    // ]
    checkSchema(createUserValidationSchema),  
    (request, response) => {
      console.log(request.body);
      const result = validationResult(request);
      console.log(result);

      if(!result.isEmpty()) {
        return response.status(400).send({ errors: result.array() });
      }

      const data = matchedData(request);
      console.log(data);
    
      const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
      mockUsers.push(newUser);
      return response.status(201).send(newUser);
    }
);

// PUT
app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.sendStatus(200);
});

// PATCH
app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.sendStatus(200);
});

// DELETE
app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const {findUserIndex } = request;
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);
});


app.listen(PORT, () => {
    console.log(`Running on Port ${localhost}:${PORT}`);
});