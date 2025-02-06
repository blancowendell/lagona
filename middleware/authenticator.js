const jwt = require("jsonwebtoken");
const {
  Decrypter,
  DecrypterString,
} = require("../routes/repository/crytography");
const { UnauthorizedTemplate } = require("../routes/repository/helper");

const verifyJWT = (req, res, next) => {
  const token =
    req.session.jwt ?? req.body.APK ?? req.query.APK ?? req.params.APK;
  if (!token) {
    return res.status(401).send(UnauthorizedTemplate());
  }
  

  Decrypter(token, (err, data) => {
    if (err) {
      return res.status(404).json({ msg: err });
    } else {
      jwt.verify(data, process.env._SECRET_KEY, (err, decoded) => {
        if (err) {
          console.log("JWT Error: ", err);
          return res.status(403).json({ msg: err });
        }
        req.user = decoded;
        next();
      });
    }
  });
};

module.exports = verifyJWT;