const bcrypt = require("bcryptjs");

module.exports.HashPass = (ps) => {
  /**Bcrypt only hashes Strings */
  return bcrypt.hash(ps.toString(), 12);
};

module.exports.comparePass = (loginPassword, ps) => {
  return bcrypt.compare(loginPassword, ps);
};
