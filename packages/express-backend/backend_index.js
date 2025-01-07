import express, { json } from "express";
import cors from "cors";

import { findUserById, findUserByName, findUserByJob, addUser, getUsers, deleteUser } from "./services/user-service.js";

// express API setup

const app = express();
const port = 8000; // port for the server side

app.use(cors()); // enables all CORS requests
app.use(express.json());

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

// API endpoints

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// gets users by name and/or job via query or gets all users
app.get("/users", (req, res) => {
  const name = req.query.name; // extract 'name' query parameter
  const job = req.query.job;  // extract 'job' query parameter

  // Call the getUsers function to fetch users based on query parameters
  getUsers(name, job)
    .then((users) => {
      // Wrap the result into response dictionary form
      res.send({ users_list: users });
    })
    .catch((error) => {
      // Handle any errors during the database fetch
      console.error("Error fetching users:", error);
      res.status(500).send({ error: "Internal Server Error" });
    });
});

// gets a user by id (doesn't work if id not in correct 24 digit hex format)
app.get("/users/:id", (req, res) => {
  const id = req.params.id; // Extract the 'id' parameter from the request URL

  // Call the findUserById function to fetch user by ID
  findUserById(id)
    .then((user) => {
      if (!user) {
        // If no user is found, return 404 Not Found
        res.status(404).send({ error: "Resource not found." });
      } else {
        // Send the found user
        res.send(user);
      }
    })
    .catch((error) => {
      // Handle database errors or invalid input
      console.error("Error fetching user by ID:", error);
      res.status(500).send({ error: "Internal Server Error" });
    });
});

// adds a user
app.post("/users", (req, res) => {
  const userToAdd = req.body; // Extract the user object from request body

  addUser(userToAdd) // Call the addUser function, which returns a Promise
    .then((newUser) => {
      // Send back the created user with a 201 status code
      res.status(201).send(newUser);
    })
    .catch((error) => {
      // Handle database errors or invalid input
      console.error("Error adding user:", error);
      res.status(500).send({ error: "Internal Server Error" });
    });
});

// deletes first instance of a user by id
app.delete('/users/:id', async (req, res) => {
  const userToDel = req.params.id;
  const result = deleteUser(userToDel);
  if(result){
    res.status(204).end();
  }
  res.status(404).end();
});