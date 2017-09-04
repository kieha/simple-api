const Journal = require("../models/journal");

module.exports = {
  create: (req, res) => {
    const journal = new Journal();

    journal.title = req.body.title;
    journal.entry = req.body.entry;

    journal.save((err) => {
      if (err) {
        if (err.code === 11000) {
          res.status(409).send({ error: "Journal entry with this title already exists." });
        } else {
          res.status(400).send({ error: err.message });
        }
      } else {
        res.status(201).send({
          message: "Journal entry saved successfully",
          journal,
        });
      }
    });
  },

  all: (req, res) => {
    Journal.find({}, (err, entries) => {
      if (err) {
        res.status(400).send({ error: "Error fetching journal entries", err });
      } else if (entries.length === 0) {
        res.status(404).send({ message: "No journal entries to retrieve" });
      } else {
        res.status(200).send(entries);
      }
    });
  },

  delete: (req, res) => {
    Journal.remove({}, (err, entries) => {
      if (err) {
        res.status(400).send({ error: "Error deleting journal entries", err });
      } else if (entries.result.n === 0) {
        res.status(404).send({ message: "No journal entries to delete" });
      } else {
        res.status(200).send({ message: "Journal entries deleted" });
      }
    });
  },
};
