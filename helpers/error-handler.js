function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ message: "The user is not authorized" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).send({ message: err });
  }
  return res.status(500).send({ message: err });
}
module.exports = errorHandler;
