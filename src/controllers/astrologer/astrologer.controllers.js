import AstrologerService from "../../services/astrologer/astrologer.services.js";

export const getAstrologer = async (req, res) => {
  try {
    // get the phone number from the request body
    const { phoneNumber } = req.body;
    // send get request to database
    const astrologer = await AstrologerService.getAstrologer(phoneNumber);
    // return user
    res.status(200).json({
      astrologer: astrologer,
      success: true,
      message: "Fetched astrologer data successfully",
    });
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
        message: "Astrologer already exists, Otp sent successfully",
        success: true,
        otp: otp,
      });
    } else {
      // generate otp of 4 digits
      const otp = AstrologerService.generateOtp();
      console.log(phoneNumber);
      const newAstrologer = await AstrologerService.createAstrologer(
        phoneNumber
      );
      console.log(newAstrologer);
      await AstrologerService.updateOtp(phoneNumber, otp, newAstrologer);
      // return the otp as data
      res.status(201).json({
        message: "New Astrologer login, Otp sent successfully",
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
      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      // return the auth token to the req sender
      return res.status(200).json({
        message: "Otp verified & Astrologer logged In successfully",
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

export const updateAstrologer = async (req, res) => {
  try {
    // make a prisma client astrologer updation request to the database
    const Astrologer = await AstrologerService.updateAstrologer(req.body);
    // return the updated astrologer data
    console.log(Astrologer);
    return res.status(201).json({ astrologer: Astrologer });
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