import UserService from "../../services/user/user.services.js";

export const getUser = (req, res) => {
  res.send({ name: "subha", email: "subha@gmail.com" });
};

export const loginUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    // check if the user already exists return true or false
    const User = await UserService.checkUserExistance(phoneNumber);
    if (User) {
      // generate otp of 4 digits
      const otp = UserService.generateOtp();
      await UserService.updateOtp(phoneNumber, otp, User);
      // return user already exists message along with login otp
      return res.status(201).json({
        message: "User already exists, Otp sent successfully",
        success: true,
        otp: otp,
      });
    } else {
      // generate otp of 4 digits
      const otp = UserService.generateOtp();
      console.log(phoneNumber)
      const newUser = await UserService.createUser(phoneNumber);
      console.log(newUser)
      await UserService.updateOtp(phoneNumber, otp, newUser);
      // return the otp as data
      res.status(201).json({
        message: "New User login, Otp sent successfully",
        success: true,
        otp: otp,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    // find user and get otp and save it to a variable
    const otpVerified = await UserService.verifyOtp(phoneNumber, otp);
    if (!otpVerified) {
      // if failed then return warning
      return res.status(400).json({
        message: "Wrong Otp please try again",
        success: false,
      });
    } else {
      // if successful generate an auth token
      const token = await UserService.generateToken(phoneNumber);
      // return the auth token to the req sender
      return res.status(200).json({
        message: "Otp verified & User logged In successfully",
        success: true,
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
