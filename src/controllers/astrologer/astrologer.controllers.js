import AstrologerService from "../../services/astrologer/astrologer.services.js";


export const getAstrologer = (req, res) => {
  res.send({ name: "subha", email: "subha@gmail.com" });
};

export const loginAstrologer = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    // check if the astrologer already exists return true or false
    const Astrologer = await AstrologerService.checkAstrologerExistance(phoneNumber);
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
      const newAstrologer = await AstrologerService.createAstrologer(phoneNumber);
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
      const token = await AstrologerService.generateToken(phoneNumber);
      // return the auth token to the req sender
      return res.status(200).json({
        message: "Otp verified & Astrologer logged In successfully",
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