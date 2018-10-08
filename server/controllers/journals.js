/* eslint-disable no-param-reassign */

import Journal from '../models/journal';

module.exports = {
  create: (req, res) => {
    const journal = new Journal();

    journal.title = req.body.title;
    journal.entry = req.body.entry;

    journal.save((err) => {
      if (err) {
        if (err.code === 11000) {
          res.status(409).send({ error: 'Journal entry with this title already exists.' });
        } else {
          res.status(400).send({ error: err.message });
        }
      } else {
        res.status(201).send({
          message: 'Journal entry saved successfully',
          journal,
        });
      }
    });
  },

  getAll: (req, res) => {
    Journal.find({}, (err, entries) => {
      if (err) {
        res.status(400).send({ error: 'Error fetching journal entries', err });
      } else if (entries.length === 0) {
        res.status(200).send({ message: 'No journal entries to retrieve' });
      } else {
        res.status(200).send(entries);
      }
    });
  },

  deleteAll: (req, res) => {
    Journal.remove({}, (err, entries) => {
      if (err) {
        res.status(400).send({ error: 'Error deleting journal entries', err });
      } else if (entries.result.n === 0) {
        res.status(200).send({ message: 'No journal entries to delete' });
      } else {
        res.status(200).send({ message: 'Journal entries deleted' });
      }
    });
  },

  findOne: (req, res) => {
    Journal.findById(req.params.id, (err, entry) => {
      if (err) {
        res.status(400).send({ error: 'Error retrieving journal entry', err });
      } else if (entry === null) {
        res.status(404).send({ error: 'Journal entry not found' });
      } else {
        res.status(200).send(entry);
      }
    });
  },

  updateOne: (req, res) => {
    Journal.findById(req.params.id, (err, entry) => {
      if (err) {
        res.status(400).send({ error: 'Error locating journal entry', err });
        return;
      } else if (entry === null) {
        res.status(404).send({ error: 'Journal entry not found' });
        return;
      } else if (Object.keys(req.body).length === 0) {
        res.status(400).send({ error: 'Nothing to update.' });
        return;
      }

      Object.keys(req.body).forEach((key) => {
        entry[key] = req.body[key];
      });

      entry.save((error) => {
        if (error) {
          if (error.code === 11000 || error.code === 11001) {
            res.status(409).send({ error: 'Journal entry with this title already exists.' });
          } else {
            res.status(400).send({ error: error.message });
          }
        } else {
          res.status(200).send({
            message: 'Journal entry updated successfully',
            entry,
          });
        }
      });
    });
  },

  deleteOne: (req, res) => {
    Journal.findById(req.params.id, (err, entry) => {
      if (err) {
        res.status(400).send({ error: 'Error locating journal entry:', err });
        return;
      } else if (entry === null) {
        res.status(404).send({ error: 'Journal entry not found' });
        return;
      }
      entry.remove((error) => {
        if (error) {
          res.status(400).send({ error: `Error deleting journal entries: ${error}` });
        } else {
          res.status(200).send({ message: 'Journal entry deleted' });
        }
      });
    });
  },
};
