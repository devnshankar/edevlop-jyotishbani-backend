import UserService from "../../services/user/user.services.js";

export const getUser = async (req, res) => {
  try {
    // get the phone number from the request body
    const { phoneNumber } = req.body;
    // send get request to database
    const user = await UserService.getUser(phoneNumber);
    // return user
    res.status(200).json({
      user: user,
      success: true,
      message: "Fetched user data successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
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
      const newUser = await UserService.createUser(phoneNumber);
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

export const verifyUserOtp = async (req, res) => {
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
      const accessToken = await UserService.generateToken(phoneNumber, "6h");
      const refreshToken = await UserService.generateToken(phoneNumber, "3d");
      // Set tokens as cookies
      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      // return the auth token to the req sender
      return res.status(200).json({
        message: "Otp verified & User logged In successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    // make a prisma client user updation request to the database
    const User = await UserService.updateUser(req.body);
    // return the updated user data
    console.log(User);
    return res.status(201).json({ user: User });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    // make a prisma client user updation request to the database
    const status = await UserService.deleteUser(phoneNumber);
    // return true when user deleted
    if (status) {
      return res
        .status(201)
        .json({ message: "User deleted successfully", success: true });
    } else {
      return res.status(201).json({
        message: "User could not be deleted, Try again",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
