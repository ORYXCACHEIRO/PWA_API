const jwt = require("jsonwebtoken");
const config = require('../config/db');

const verifyToken = (req, res, next) => {
  
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send("A token is required for authentication").end();
  }
    
  jwt.verify(token, config.secret, (err, decoded) => {

    if(err){
      return res.status(401).send("Invalid Token").end();
    }

    req.user_email = decoded.email;
    req.user_id = decoded.id;
    req.user_role = decoded.role;

    console.log("verified");
    return next();
  });
};

module.exports = verifyToken;