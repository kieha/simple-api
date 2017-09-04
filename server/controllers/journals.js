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
        res.status(200).send({
          message: "Journal entry saved successfully",
          journal,
        });
      }
    });
  },
};
