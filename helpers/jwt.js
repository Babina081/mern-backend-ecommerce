const { expressjwt } = require("express-jwt");
function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      //check in regex101
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevoked(req, jwt) {
  // Reject the token if the user is not an admin
  const payload = jwt.payload;
  if (!payload.isAdmin) {
    return true; // Token is revoked
  }
  return false; // Token is valid
}

module.exports = authJwt;
