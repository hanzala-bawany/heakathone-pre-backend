import { Users } from "../modules/authModule.js";
import { successHandler, errorHandler } from "../utills/resHandler.js";
import pkg from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv"

dotenv.config();



const { sign } = pkg;
const { hash, compare } = bcrypt;


// signup controller
export const signupController = async (req, res) => {
  // console.log("siignup chala");
  try {
    // console.log(req.body , "body bhi mile");
    const { userName , fatherName , email , password , age } = req.body;

    if (!userName || !email || !password || !fatherName || !age)
      return errorHandler(res, 404, "Miising Fields !");

    if (!email.includes("@"))
      return errorHandler(res, 400, "Email is not valid");

    if (password.length < 6 || password.length > 12)
      return errorHandler(
        res,
        400,
        "Password must greater then 6 and less then 12"
      );

    const isExist = await Users.findOne({ email: email });
    if (isExist) return errorHandler(res, 402, "User already exist");

    try {
      const hashedPass = await hash(password, 10);
      // const verificationCode = Math.floor(100000 + Math.random() * 900000);

      const userData = new Users({
        userName,
        fatherName,
        email,
        password: hashedPass,
        age
      });
      const newUser = await userData.save()
      const {password : _ , ...otherDetail} = newUser._doc

      return successHandler(res, 200, `user register succefully`, otherDetail);

    } catch (error) {
      console.log(error, "---> registration me error he");
      errorHandler(res,500,error?.message)
    }

  } catch (error) {
    console.log(error, "---> registration me error he");
    errorHandler(res,500,error?.message , error)
  }
};


// login controller
export const loginController = async (req, res) => {
  console.log("login chala");

  try {
    const { email, password } = req.body;

    if (!email || !password) return errorHandler(res, 404, "Mising Fields !");

    if (!email.includes("@"))
      return errorHandler(res, 400, "Email is not valid");

    if (password.length < 6 || password.length > 12)
      return errorHandler(
        res,
        400,
        "Invalid password"
      );

    const isExist = await Users.findOne({ email: email });
    if (!isExist) return errorHandler(res, 402, "User not found");

    const comparePass = await compare(password, isExist?.password);
    if (!comparePass) return errorHandler(res, 404, "invalid password");

    const token = sign(
      {
        userId: isExist._id,
        userEmail: email,
        isAdmin: isExist.isAdmin,
      },
      process.env.JWT_secretKey,
      { expiresIn: "24h" }
    );

    // res.cookie("token", token, {
    //   httpOnly: true, //  < --- matlab sirf server side yani backend se hi cookie ko access/handle kia ja sakta he
    //   sameSite: process.env.NODE_ENV === "development" ? "lax" : "none"  , //  < --- yani diff origin/port sen req aengi un me cookie ko save nahi kia jae ga browser me save get and post samoeTime
    //   secure: process.env.NODE_ENV == "development" ? false : true , // ⚠️ <-- alllow for only http
    // });

    // const {password : _ , ...otherDetail} = isExist?._doc
    console.log("login in  successfully",isExist?._doc);
    successHandler(res, 200, "User login successfully", token);

  } catch (err) {
    console.log(err, "loginUser me error he");
    errorHandler(res, 402, err?.message , err);
  }

};

