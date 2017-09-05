const Journals = require("../controllers/journals");

module.exports = (router) => {
  router.route("/journals")
    .post(Journals.create)
    .get(Journals.all)
    .delete(Journals.delete);

  router.route("/journals/:id")
    .get(Journals.find)
    .put(Journals.update)
    .delete(Journals.deleteOne);
};
