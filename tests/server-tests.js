/* eslint-disable no-underscore-dangle */

const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require("chai").expect;

const app = require("../index");
const Journal = require("../server/models/journal");
const request = require("supertest")(app);

describe("Journal", () => {
  let journalId;

  it("should delete all journal entries", (done) => {
    request
      .delete("/api/journals")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("Journal entries deleted");
        done();
      });
  });

  it("should throw an error if there are no journal entries to delete", (done) => {
    request
      .delete("/api/journals")
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("No journal entries to delete");
        done();
      });
  });

  it("should throw an error if there are no journal entries to retrieve", (done) => {
    request
      .get("/api/journals")
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("No journal entries to retrieve");
        done();
      });
  });

  it("should create new journal entries", (done) => {
    request
      .post("/api/journals/new")
      .send({
        title: "Entry 1",
        entry: "Journal entry number 1",
      })
      .end((err, res) => {
        journalId = res.body.journal._id;
        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal("Journal entry saved successfully");
        expect(res.body.journal).to.be.a("object");
        done();
      });
  });

  it("should check for unique titles in new journal entries", (done) => {
    const title = Journal.schema.paths.title;
    expect(title.options.unique).to.equal(true);
    done();
  });

  it("should throw an error on duplicate journal titles", (done) => {
    request
      .post("/api/journals/new")
      .send({
        title: "Entry 1",
        entry: "Journal entry number 2",
      })
      .end((err, res) => {
        expect(res.status).to.equal(409);
        expect(res.body.error).to.equal("Journal entry with this title already exists.");
        done();
      });
  });

  it("should retrieve all journal entries", (done) => {
    request
      .get("/api/journals")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("array");
        done();
      });
  });

  it("should retrieve journal entries by id", (done) => {
    request
      .get(`/api/journals/${journalId}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("object");
        done();
      });
  });

  it("should thow an error if journal entry is not found", (done) => {
    request
      .get("/api/journals/9e799c0e692b79bdc83f082a")
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("Journal entry not found");
        done();
      });
  });

  it("should thow an error if an error occurs", (done) => {
    request
      .get("/api/journals/9e799c0e692b79bdc83f0")
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("Error retrieving journal entry");
        done();
      });
  });
});
