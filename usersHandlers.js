const database = require("./database");

const getUsers = (req, res) => {
  database.query("select * from users").then((i) => {
    res.status(200).json(i[0]);
  });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);
  database

    .query("select * from users where id = ?", [id])

    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })

    .catch((err) => {
      console.error(err);

      res.status(500).send("Error retrieving data from database");
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query("insert into users set ?", [
      { firstname, lastname, email, city, language },
    ])
    .then(([result]) => {
      res.status(201).json({
        id: result.insertId,
        firstname,
        lastname,
        email,
        city,
        language,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
};

const putUser = (req, res) => {
  database
    .query("UPDATE users SET ? WHERE id = ?", [req.body, req.params.id])
    .then(([result]) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  getUsers,
  getUsersById,
  postUser,
  putUser,
};
