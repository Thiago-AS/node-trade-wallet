const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

module.exports = {
  generateToken(id) {
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: 86400
    });
  },
  
  validateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const [bearer, token] = authHeader.split(" ");
    if (!bearer || !token || !/^Bearer$/i.test(bearer))
      return res.status(401).json({ error: "Token error" });

    try {
      const decoded = jwt.verify(token, authConfig.secret);
      req.userId = decoded.id;
      return next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }
};