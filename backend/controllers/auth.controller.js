import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generatetokenandsetcookie } from "../utils/generatetokenandsetcookie.js";
import { generateverificationcode } from "../utils/generateverificationcode.js";

import { sendverificationemail, sendwelcomeemail,sendpasswordresetemail,sendresetsuccessemail } from "../mailtrap/emails.js";
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

    console.log(verifcationcode);
    const user = new User({
      email,
      password: hashedpassword,
      name,
      verificationToken: verifcationcode,
      verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    console.log(user);

    await user.save();

    // res.send(user);

    const x = generatetokenandsetcookie(res, user._id);
    console.log(x);
    await sendverificationemail(user.email, verifcationcode);

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

export const verifyemail = async (req, res) => {
  const { verificationToken } = req.body;
  try {
    if (!verificationToken) {
      throw new Error("Please provide verification code");
    }

    const user = await User.findOne({
      verificationToken,
      verificationTokenExpireAt: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error(
        "Invalid verification code or verficiation token expires"
      );
    }

    user.isverified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpireAt = undefined;
    await user.save();

    await sendwelcomeemail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "email verified verified",
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
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("Please fill all the fields");
    }

    const user=await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isMatch = await bcryptjs.compare(password, user.password);

   if(!isMatch) {
    throw new Error("Invalid credentials");
   }

   generatetokenandsetcookie(res,user._id);

    user.lastlogin =new Date();
    await user.save();
    res.status(200).json({
      success:true,
      message:"User logged in",
      user:{
        ...user._doc,
        password:undefined
      }
    
    });


  } catch (err) {
    console.log("error in login",err);
    res.status(400).json({ success: false, message: err.message });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "logout successfully" });
};

export const forgotpassword= async (req, res) => {
      const {email}=req.body;

      try{
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("User not found");
        }

        const resetToken = crypto.randomBytes(20).toString("hex");

        const resettokenexpiresat = Date.now() + 3 * 60 * 60 * 1000;
        user.resetPasswordToken=resetToken;
        user.resetPasswordExpireAt=resettokenexpiresat;
        await user.save();

        await sendpasswordresetemail(user.email,`${process.env.CLIENT_URL}/resetpassword/${resetToken}`);
        
        res.status(200).json({ success: true, message: "Reset password link sent to your email" });
     
       
      }catch(err)
      {
        console.log("error in forgot password route",err);
        res.status(400).json({success:false,message:err.message});
      }


};

export const resetpassword= async (req, res) => {

  try{
     const {token} = req.params;
     const {password} = req.body;
     const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpireAt: { $gt: Date.now() } });

  if(!user)
  {
    return res.status(404).json({success:false,message:"Invalid token or token expired"});
  }

    const hashedpassword = await bcryptjs.hash(password, 8);
    user.password = hashedpassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;
    await user.save();
    await sendresetsuccessemail(user.email);
    res.status(200).json({ success: true, message: "Password reset successfully" });

  }
  catch(err){
    console.log("error in reset password route damaged",err);
    res.status(400).json({success:false,message:err.message});
  }
};
