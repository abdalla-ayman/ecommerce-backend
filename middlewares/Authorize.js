const authorize = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: "Login first" });
  }
};

module.exports = authorize;
