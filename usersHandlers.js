const database = require("./database");

const getUsers = (req, res) => {
  let sql = "select firstname, lastname, email, city, language from users";
  const sqlValues = [];

  if (req.query.language != null) {
    sql += " where language = ?";

    sqlValues.push(req.query.language);
  } else if (req.query.city != null) {
    sql += " where city = ?";

    sqlValues.push(req.query.city);
  }
  database.query(sql, sqlValues).then((i) => {
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
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;
  database
    .query("insert into users set ?", [
      { firstname, lastname, email, city, language, hashedPassword },
    ])
    .then(([result]) => {
      res.status(201).json({
        id: result.insertId,
        firstname,
        lastname,
        email,
        city,
        language,
        hashedPassword,
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

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database

    .query("delete from users where id = ?", [id])

    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })

    .catch((err) => {
      console.error(err);

      res.status(500).send("Error deleting the user");
    });
};

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const { email } = req.body;

  database
    .query("select * from users where email = ?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        req.user = users[0];

        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

module.exports = {
  getUsers,
  getUsersById,
  postUser,
  putUser,
  deleteUser,
  getUserByEmailWithPasswordAndPassToNext,
};
