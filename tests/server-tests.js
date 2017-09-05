const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require("chai").expect;

const app = require("../index");
const request = require("supertest")(app);

describe("Journal", () => {
  it("should create new journal entries", (done) => {
    request
      .post("/api/journals/new")
      .send({
        title: "Entry 1",
        entry: "Journal entry number 1",
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal("Journal entry saved successfully");
        expect(res.body.journal).to.be.a("object");
        done();
      });
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
});
