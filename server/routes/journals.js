const Journals = require("../controllers/journals");

module.exports = (router) => {
  router.route("/journals")
    .post(Journals.create)
    .get(Journals.getAll)
    .delete(Journals.deleteAll);

  router.route("/journals/:id")
    .get(Journals.findOne)
    .put(Journals.updateOne)
    .delete(Journals.deleteOne);
};
