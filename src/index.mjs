import express, { request, response } from "express";

const app = express();

app.use(express.json());

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

// Route parameter (localhost:3000/api/users/id)
app.get("/api/users/:id", (request, response) => {
    console.log(request.params);
    const parsedId = parseInt(request.params.id);
    console.log(parsedId);
    if(isNaN(parsedId)) {
        return response.status(400).send({ msg: "Bad Request. Invalid ID." });
    }
    const findUser = mockUsers.find((user) => user.id === parsedId);
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
app.put("/api/users/:id", (request, response) => {
    const { body, params: { id }, } = request;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) {
        return response.sendStatus(400);
    }  
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) {
        return response.sendStatus(404);
    }  
    mockUsers[findUserIndex] = { id: parsedId, ...body };
    return response.sendStatus(200);
});

// PATCH
app.patch("/api/users/:id", (request, response) => {
    const { body, params: { id }, } = request;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) {
        return response.sendStatus(400);
    }  
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) {
        return response.sendStatus(404);
    }  
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.sendStatus(200);
});

// DELETE
app.delete("/api/users/:id", (request, response) => {
    const { params: { id }, } = request;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) {
        return response.sendStatus(400);
    }
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) {
        return response.sendStatus(404);
    }
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);
});


app.listen(PORT, () => {
    console.log(`Running on Port ${localhost}:${PORT}`);
});