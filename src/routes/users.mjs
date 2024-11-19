import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";

const router = Router();

// GET
router.get(
    "/api/users",
    query("filter") // Query parameter validator
      .isString()
      .notEmpty()
      .withMessage("Must not be empty")
      .isLength({ min: 3, max: 10 })
      .withMessage("Must be at least 3-10 characters"),
    (request, response) => {
      console.log(request.session);
      console.log(request.session.id);
      request.sessionStore.get(request.session.id, (err, sessionData) => {
        if(err) {
          console.log(err);
          throw err;
        }
        console.log("Inside Session Store Get");
        console.log(sessionData);
      });
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
      return response.send(mockUsers);
    }  
);

router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
    if(!findUser) {
        return response.sendStatus(404); // Not Found
    } else {
        return response.send(findUser);
    }
});

// unit testing the /api/users/:id 
router.get("/api/users/:id", resolveIndexByUserId, getUserByIdHandler);

// POST
// router.post(
//     "/api/users",
//     // [
//     //   body("username") // body() is a request body in that validate a specific field like id, username, displayName etc.
//     //     .notEmpty()
//     //     .withMessage("username cannot be emmpty")
//     //     .isLength({ min: 5, max: 32 })
//     //     .withMessage("username must be at least 5 characters with a max of 32 characters")
//     //     .isString()
//     //     .withMessage("username must be a string!"),
//     //   body("displayName")
//     //     .notEmpty()
//     //     .withMessage('displayName cannot be emmpty'),   
//     // ]
//     checkSchema(createUserValidationSchema),  
//     (request, response) => {
//       console.log(request.body);
//       const result = validationResult(request);
//       console.log(result);

//       if(!result.isEmpty()) {
//         return response.status(400).send({ errors: result.array() });
//       }

//       const data = matchedData(request);
//       console.log(data);
    
//       const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
//       mockUsers.push(newUser);
//       return response.status(201).send(newUser);
//     }
// );

// adding users document collection in mongoDB database
router.post(
  "/api/users", 
  checkSchema(createUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);
    if(!result.isEmpty()) return response.status(400).send(result.array());
 
    const data = matchedData(request);
    console.log(data);
    data.password = hashPassword(data.password);
    console.log(data);
    const newUser = new User(data);
    // const { body } = request;
    // const newUser = new User(body);
    try {
      const savedUser = await newUser.save();
      return response.status(201).send(savedUser);
    } catch (err) {
      console.log(err);
      return response.sendStatus(400);
    }
  }
);

// unit testing the /api/users
router.post(
  "/api/users", 
  checkSchema(createUserValidationSchema),
  createUserHandler
);

// PUT
router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.sendStatus(200);
});

// PATCH
router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.sendStatus(200);
});

// DELETE
router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const {findUserIndex } = request;
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);
});

export default router;