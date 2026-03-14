const jwt=require('jsonwebtoken');

const authCheck = async (req, res, next) => {

  let token =
    req.body?.token ||
    req.query?.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is required"
    });
  }

  try {

    // Remove Bearer if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });

  }
};

module.exports = authCheck;