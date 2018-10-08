import journals from './journals';

module.exports = (apiRouter) => {
  journals(apiRouter);

  return apiRouter;
};
