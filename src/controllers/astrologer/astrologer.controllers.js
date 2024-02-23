import AstrologerService from "../../services/astrologer/astrologer.services.js";

export const getAstrologer = async (req, res) => {
  try {
    // get the phone number from the request body
    const { phoneNumber } = req.body;
    // send get request to database
    const astrologer = await AstrologerService.getAstrologer(phoneNumber);
    // return user
    res.status(200).json({
      success: true,
      message: "Fetched astrologer data successfully",
      data: {
        astrologer: astrologer,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const astrologerAccessTokenProvider = async (req, res) => {
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
          status: false,
          message: "Token expired. Please Login Again",
          ERROR_CODE: 3503,
        });
      } else {
        // if refresh token is present and valid and also not expired then
        // generate new accessToken
        const accessToken = await AstrologerService.generateToken(
          decodedRefreshToken.phoneNumber,
          "6h"
        );
        // send the new accessToken through cookies
        // res.cookie("accessToken", accessToken, { httpOnly: true });  //
        res.status(200).json({
          status: true,
          message: "New access token assigned",
          data: {
            accessToken: accessToken,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginAstrologer = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    // check if the astrologer already exists return true or false
    const Astrologer = await AstrologerService.checkAstrologerExistance(
      phoneNumber
    );
    if (Astrologer) {
      // generate otp of 4 digits
      const otp = AstrologerService.generateOtp();
      await AstrologerService.updateOtp(phoneNumber, otp, Astrologer);
      // return astrologer already exists message along with login otp
      return res.status(201).json({
        success: true,
        message: "Astrologer already exists, Otp sent successfully",
        data: {
          otp: otp,
        },
      });
    } else {
      // generate otp of 4 digits
      const otp = AstrologerService.generateOtp();
      const newAstrologer = await AstrologerService.createAstrologer(
        phoneNumber
      );
      await AstrologerService.updateOtp(phoneNumber, otp, newAstrologer);
      // return the otp as data
      res.status(201).json({
        success: true,
        message: "New Astrologer login, Otp sent successfully",
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

export const verifyAstrologerOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    // find user and get otp and save it to a variable
    const otpVerified = await AstrologerService.verifyOtp(phoneNumber, otp);
    if (!otpVerified) {
      // if failed then return warning
      return res.status(400).json({
        message: "Wrong Otp please try again",
        success: false,
      });
    } else {
      // if successful generate an auth token
      const accessToken = await AstrologerService.generateToken(phoneNumber, "6h");
      const refreshToken = await AstrologerService.generateToken(phoneNumber, "3d");
      // Set tokens as cookies
      // res.cookie("accessToken", accessToken, { httpOnly: true });
      // res.cookie("refreshToken", refreshToken, { httpOnly: true });
      // return the auth token to the req sender
      return res.status(200).json({
        success: true,
        message: "Otp verified & Astrologer logged In successfully",
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

export const updateAstrologer = async (req, res) => {
  try {
    // make a prisma client astrologer updation request to the database
    const Astrologer = await AstrologerService.updateAstrologer(req.body);
    // return the updated astrologer data
    return res.status(201).json({
      success: true,
      message: "Astrologer data updated successfully",
      data: {
        astrologer: Astrologer,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const deleteAstrologer = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    // make a prisma client user updation request to the database
    const status = await AstrologerService.deleteAstrologer(phoneNumber);
    // return true when user deleted
    if (status) {
      return res
        .status(201)
        .json({ message: "Astrologer deleted successfully", success: true });
    } else {
      return res.status(201).json({
        success: false,
        message: "User could not be deleted, Try again",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};