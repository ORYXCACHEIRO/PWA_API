const jwt = require("jsonwebtoken");
const config = require('../config/config');

const verifyToken = (req, res, next) => {
  
  let token = req.cookies.tokenn;

  if (!token) {
    return res.status(401).send({auth:false, message: 'No token provided'}).end();
  }
    
  jwt.verify(token, config.secret, (err, decoded) => {

    if(err){
      //console.log(err);
      return res.status(500).send({auth:false, message: 'Invalid Token'}).end();
    }

    //console.log(decoded);

    req.user_email = decoded.email;
    req.user_id = decoded.id;
    req.user_role = decoded.role;

    //console.log("verified");
    return next();
  });
};

module.exports = verifyToken;