const journals = require("./journals");

module.exports = (apiRouter) => {
  journals(apiRouter);

  return apiRouter;
};
