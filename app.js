require("dotenv").config();

const port = process.env.APP_PORT ?? 8000;

const express = require("express");

const app = express();

app.use(express.json());

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const {
  getUsers,
  getUsersById,
  postUser,
  putUser,
  deleteUser,
} = require("./usersHandlers");

const { hashPassword } = require("./auth.js");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", getUsers);
app.get("/api/users/:id", getUsersById);

app.post("/api/users", hashPassword, postUser);

app.put("/api/users/:id", putUser);

app.delete("/api/users/:id", deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
