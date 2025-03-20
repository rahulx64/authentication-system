import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generatetokenandsetcookie } from "../utils/generatetokenandsetcookie.js";
import { generateverificationcode } from "../utils/generateverificationcode.js";

import { sendverificationemail } from "../mailtrap/emails.js";
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("Please fill all the fields");
    }

    const useralreadyexist = await User.findOne({ email });
    if (useralreadyexist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    const hashedpassword = await bcryptjs.hash(password, 8);
    const verifcationcode = generateverificationcode();

    const user = new User({
      email,
      password: hashedpassword,
      name,
      verificationToken: verifcationcode,
      verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    // res.send(user);

    generatetokenandsetcookie(res, user._id);

   await sendverificationemail(user.email,verifcationcode);


    res.status(201).json({
      success: true,
      message: "User created",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  res.send("login route");
};
export const logout = async (req, res) => {
  res.send("logout route");
};
