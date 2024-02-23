import AdminService from "../../services/admin/admin.services.js";

export const getAdmin = async (req, res) => {
  try {
    // get the phone number from the request body
    const { phoneNumber } = req.body;
    // send get request to database
    const admin = await AdminService.getAdmin(phoneNumber);
    // return user
    res.status(200).json({
      success: true,
      message: "Fetched astrologer data successfully",
      data: {
        admin: admin,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const adminAccessTokenProvider = async (req, res) => {
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
        const accessToken = await AdminService.generateToken(
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

export const loginAdmin = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    // check if the admin already exists return true or false
    const Admin = await AdminService.checkAdminExistance(phoneNumber);
    if (Admin) {
      // generate otp of 4 digits
      const otp = AdminService.generateOtp();
      await AdminService.updateOtp(phoneNumber, otp, Admin);
      // return admin already exists message along with login otp
      return res.status(201).json({
        message: "Admin already exists, Otp sent successfully",
        success: true,
        otp: otp,
      });
    } else {
      // generate otp of 4 digits
      const otp = AdminService.generateOtp();
      const newAdmin = await AdminService.createAdmin(phoneNumber);
      await AdminService.updateOtp(phoneNumber, otp, newAdmin);
      // return the otp as data
      res.status(201).json({
        message: "New Admin login, Otp sent successfully",
        success: true,
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

export const verifyAdminOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    // find user and get otp and save it to a variable
    const otpVerified = await AdminService.verifyOtp(phoneNumber, otp);
    if (!otpVerified) {
      // if failed then return warning
      return res.status(400).json({
        message: "Wrong Otp please try again",
        success: false,
      });
    } else {
      // if successful generate an auth token
      const accessToken = await AdminService.generateToken(phoneNumber, "6h");
      const refreshToken = await AdminService.generateToken(phoneNumber, "3d");
      // Set tokens as cookies
      // res.cookie("accessToken", accessToken, { httpOnly: true });
      // res.cookie("refreshToken", refreshToken, { httpOnly: true });
      // return the auth token to the req sender
      return res.status(200).json({
        success: true,
        message: "Otp verified & Admin logged In successfully",
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

export const updateAdmin = async (req, res) => {
  try {
    // make a prisma client admin updation request to the database
    const Admin = await AdminService.updateAdmin(req.body);
    // return the updated admin data
    return res.status(200).json({
      success: true,
      message: "Admin data updated successfully",
      data: {
        admin: Admin,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    // make a prisma client user updation request to the database
    const status = await AdminService.deleteAdmin(phoneNumber);
    // return true when user deleted
    if (status) {
      return res
        .status(200)
        .json({ success: true, message: "Admin deleted successfully" });
    } else {
      return res.status(201).json({
        message: "Admin could not be deleted, Try again",
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
