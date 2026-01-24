module.exports = (req, res, next) => {
  // dummy auth (for now)
  req.user = { id: "123", role: "admin" };
  next();
};
