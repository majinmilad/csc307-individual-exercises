import express, { json } from "express";
import cors from "cors";

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

// express API setup

const app = express();
const port = 8000;

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
  const name = req.query.name;
  const job = req.query.job;
  
  let result = users;

  // filter by name and/or job if applicable
  if (name != undefined) {
    result = findUserByName(name, result); // gives filtered array based on name
    result = { 'users_list': result }; // wrap array into response dictionary form
  }
  if (job != undefined) {
    result = findUserByJob(job, result); // gives filtered array based on job
    result = { 'users_list': result }; // wrap array into response dictionary form
  }

  res.send(result);
});

// gets a user by id
app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; // or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

// adds a user
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd["id"] = Math.floor(Math.random() * 100000).toString();
  addUser(userToAdd);
  res.status(201).send(userToAdd);
});

// deletes first instance of a user by id
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const index = users["users_list"].findIndex((user) => user.id.toString() === id.toString());
  if (index > -1) {
    users["users_list"].splice(index, 1);
    res.status(204).send("User found and deleted successfully");
  } else {
    res.status(404).send("User not found");
  }
});

// helpers

const findUserByName = (name, users_list) => {
  return users_list["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserByJob = (job, users_list) => {
  return users_list["users_list"].filter(
    (user) => user["job"] === job
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

// data

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};