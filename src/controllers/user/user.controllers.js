import AuthService from "../../services/auth-middleware/auth.services.js";
import UserService from "../../services/user/user.services.js";

export const getUser = async (req, res) => {
  try {
    // get the phone number from the request body
    const { phoneNumber } = req.body;
    // send get request to database
    const user = await UserService.getUser(phoneNumber);
    // return user
    res.status(200).json({
      success: true,
      message: "Fetched user data successfully",
      data: {
        user: user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const userAccessTokenProvider = async (req, res) => {
  try {
    // get the refresh token from the request headers
    let refreshToken = req.headers.referer;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: "Unauthorized request !!!",
        ERROR_CODE: 3501,
      });
    } else {
      refreshToken = refreshToken.split(" ")[1];
      const decodedRefreshToken = AuthService.decodeJWTToken(refreshToken);
      // check if the refresh token is expired
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decodedRefreshToken.exp < currentTime) {
        res.status(401).json({
          success: false,
          message: "Token expired. Please Login Again",
          ERROR_CODE: 3503,
        });
      } else {
        // if refresh token is present and valid and also not expired then
        // generate new accessToken
        const accessToken = await UserService.generateToken(
          decodedRefreshToken.phoneNumber,
          "6h"
        );
        // send the new accessToken through cookies
        // res.cookie("accessToken", accessToken, { httpOnly: true });  //
        res.status(200).json({
          success: true,
          message: "New access token assigned",
          data: {
            accessToken: accessToken,
          },
        });
        // proceed with actions
      }
    }
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
        success: true,
        message: "User already exists, Otp sent successfully",
        data: {
          otp: otp,
        },
      });
    } else {
      // generate otp of 4 digits
      const otp = UserService.generateOtp();
      const newUser = await UserService.createUser(phoneNumber);
      await UserService.updateOtp(phoneNumber, otp, newUser);
      // return the otp as data
      res.status(201).json({
        success: true,
        message: "New User login, Otp sent successfully",
        data: {
          otp: otp,
        },
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
        success: false,
        message: "Wrong Otp please try again",
      });
    } else {
      // if successful generate an auth token
      const accessToken = await UserService.generateToken(phoneNumber, "6h");
      const refreshToken = await UserService.generateToken(phoneNumber, "3d");
      // Set tokens as cookies
      // res.cookie("accessToken", accessToken, { httpOnly: true });
      // res.cookie("refreshToken", refreshToken, { httpOnly: true });
      // return the auth token to the req sender
      return res.status(200).json({
        success: true,
        message: "Otp verified & User logged In successfully",
        data: {
          access: accessToken,
          refresh: refreshToken,
        },
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
    return res.status(201).json({
      success: true,
      message: "User data updated successfully",
      data: {
        user: User,
      },
    });
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
