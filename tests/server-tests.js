/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

import { before, describe, it } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import app from '../index';
import Journal from '../server/models/journal';
import seedData from './seed/data';

const rqst = request(app);

describe('Journal', () => {
  let journalId;

  before(() => {
    Journal.create(seedData, (err) => {
      if (err) {
        console.log('Error populating DB', err);
      } else {
        console.log('DB populated');
      }
    });
  });

  it('should create new journal entries', (done) => {
    rqst
      .post('/api/journals/new')
      .send({
        title: 'Entry 1',
        entry: 'Journal entry number 1',
      })
      .end((err, res) => {
        journalId = res.body.journal._id;
        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal('Journal entry saved successfully');
        expect(res.body.journal).to.be.a('object');
        done();
      });
  });

  it('should check for unique titles in new journal entries', (done) => {
    const title = Journal.schema.paths.title;
    expect(title.options.unique).to.equal(true);
    done();
  });

  it('should throw an error on duplicate journal titles', (done) => {
    rqst
      .post('/api/journals/new')
      .send({
        title: 'Entry 1',
        entry: 'Journal entry number 2',
      })
      .end((err, res) => {
        expect(res.status).to.equal(409);
        expect(res.body.error).to.equal('Journal entry with this title already exists.');
        done();
      });
  });

  it('should retrieve all journal entries', (done) => {
    rqst
      .get('/api/journals')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('array');
        done();
      });
  });

  it('should retrieve journal entries by id', (done) => {
    rqst
      .get(`/api/journals/${journalId}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        done();
      });
  });

  it('should thow an error if journal entry is not found', (done) => {
    rqst
      .get('/api/journals/9e799c0e692b79bdc83f082a')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('Journal entry not found');
        done();
      });
  });

  it('should thow an error if an error occurs', (done) => {
    rqst
      .get('/api/journals/9e799c0e692b79bdc83f0')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Error retrieving journal entry');
        done();
      });
  });

  it('should update a given journal entry', (done) => {
    rqst
      .put(`/api/journals/${journalId}`)
      .send({
        title: 'Entry Numero Uno',
      })
      .end((req, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Journal entry updated successfully');
        expect(res.body.entry).to.be.a('object');
        done();
      });
  });

  it('should throw an error on duplicate journal titles', (done) => {
    rqst
      .put(`/api/journals/${journalId}`)
      .send({
        title: 'New Entry',
      })
      .end((err, res) => {
        expect(res.status).to.equal(409);
        expect(res.body.error).to.equal('Journal entry with this title already exists.');
        done();
      });
  });

  it('should delete a journal entry by id', (done) => {
    rqst
      .delete(`/api/journals/${journalId}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Journal entry deleted');
        done();
      });
  });

  it('should delete all journal entries', (done) => {
    rqst
      .delete('/api/journals')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Journal entries deleted');
        done();
      });
  });

  it('should throw an error if there are no journal entries to delete', (done) => {
    rqst
      .delete('/api/journals')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('No journal entries to delete');
        done();
      });
  });

  it('should throw an error if there are no journal entries to retrieve', (done) => {
    rqst
      .get('/api/journals')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('No journal entries to retrieve');
        done();
      });
  });
});
