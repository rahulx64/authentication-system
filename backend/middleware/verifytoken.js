 import jwt from "jsonwebtoken";


export const verifytoken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.userid = decode.userid; // Correctly setting user ID in request
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

