const Journals = require("../controllers/journals");

module.exports = (router) => {
  router.route("/journals").post(Journals.create);
};
