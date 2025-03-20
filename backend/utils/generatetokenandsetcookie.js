import jwt from "jsonwebtoken";

export const generatetokenandsetcookie = (res, userid) => {
  const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
    expiresIn: "700d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 700 * 24 * 60 * 60 * 1000,
  });

  return token;
};
