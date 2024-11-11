import express, { request, response } from "express";

const app = express();

app.use(express.json());

// Middleware
const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
};

// Enable Middleware Globally
// app.use(loggingMiddleware);

// Enable Middleware Globally
// we can also give multiple middleware like this as well.
// app.use(loggingMiddleware, (request, response, next) => {
//     console.log("Finished Logging...");
//     next();
// });

// Enable Middleware locally for each and every http request methods like this.
// app.get("/", loggingMiddleware, (request, response) => {
//     response.status(201).send({ msg: "Hello World!" });
// });

// Enable Middleware locally for each and every http request methods
// We can also write middleware in this type also
// app.get(
//     "/", 
//     (request, response, next) => {
//         console.log("Base URL");
//         next();
//     }, 
//     (request, response) => {
//         response.status(201).send({ msg: "Hello World!" });
//     }
// );

// Enable Middleware locally for each and every http request methods
// We can also write middleware in this type also
// We can write as many as middleware we want.
// app.get(
//     "/", 
//     (request, response, next) => {
//         console.log("Base URL 1");
//         next();
//     },
//     (request, response, next) => {
//         console.log("Base URL 2");
//         next();
//     }, 
//     (request, response, next) => {
//         console.log("Base URL 3");
//         next();
//     },
//     (request, response) => {
//         response.status(201).send({ msg: "Hello World!" });
//     }
// );

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

// Enable Middleware locally for each and every http request methods
app.get(
    "/", 
    (request, response, next) => {
        console.log("Base URL");
        next();
    },
);

app.get(
    "/", 
    (request, response, next) => {
        console.log("Base URL 1");
        next();
    }, 
    (request, response, next) => {
        console.log("Base URL 2");
        next();
    },
    (request, response, next) => {
        console.log("Base URL 3");
        next();
    },
);

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

// Always initialize middleware on the Top of the page because we won't get access to the before http request handlers(get, post, put, delete).
// app.use(loggingMiddleware, (request, response, next) => {
//     console.log("Finished Logging...");
//     next();
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
app.get("/api/users", (request, response) => {
    console.log(request.query);
    const { query: { filter, value }, } = request;
    // when filter and value are undefined
    if(!filter && !value) return response.send(mockUsers);
    if(filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    );
});

// POST
app.post("/api/users", (request, response) => {
    console.log(request.body);
    const { body } = request;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
});

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