const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");

const MongoURI =
  "mongodb+srv://salah:12345@cluster0-gku7u.mongodb.net/contact_db?retryWrites=true&w=majority";
const App = express();
App.use(express.json());
const db = "contact_db";

MongoClient.connect(MongoURI, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  console.log("DB connected !");

  const dataD = client.db(db);

  //CRUD
  App.get("/contacts", (req, res) => {
    dataD
      .collection("contact")
      .find()
      .toArray((err, data) => {
        if (err) throw err;
        res.send(data);
      });
  });
  App.post("/add-contact", (req, res) => {
    const newContact = req.body;

    dataD.collection("contact").insertOne(newContact, (err, data) => {
      if (err) throw err;
      res.send(data);
    });
  });

  App.get("/getOneContact/:id", (req, res) => {
    const { id } = req.params;
    dataD.collection("contact").findOne({ _id: ObjectID(id) }, (err, data) => {
      if (err) throw err;
      res.send(data);
    });
  });
  App.delete("/delete-Contact/:id", (req, res) => {
    const { id } = req.params;
    dataD
      .collection("contact")
      .deleteOne({ _id: ObjectID(id) }, (err, data) => {
        if (err) throw err;
        res.send("user deleted");
      });
  });

  App.put("/edit-contact/:id", (req, res) => {
    const { id } = req.params;
    const editContact = req.body;
    dataD
      .collection("contact")
      .findOneAndUpdate(
        { _id: ObjectID(id) },
        { $set: editContact },
        (err, data) => {
          if (err) throw err;
          res.send(data);
        }
      );
  });
});
const PORT = process.env.PORT || 5000;

App.listen(PORT, (err) =>
  err ? console.log(err) : console.log("the server is running 5000")
);
