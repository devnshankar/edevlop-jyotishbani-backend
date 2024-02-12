import AdminService from "../../services/admin/admin.services.js";

export const getAdmin = (req, res) => {
  res.send({ name: "subha", email: "subha@gmail.com" });
};

export const loginAdmin = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    // check if the admin already exists return true or false
    const Admin = await AdminService.checkAdminExistance(
      phoneNumber
    );
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
      console.log(phoneNumber);
      const newAdmin = await AdminService.createAdmin(
        phoneNumber
      );
      console.log(newAdmin);
      await AdminService.updateOtp(phoneNumber, otp, newAdmin);
      // return the otp as data
      res.status(201).json({
        message: "New Admin login, Otp sent successfully",
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
      const token = await AdminService.generateToken(phoneNumber);
      // return the auth token to the req sender
      return res.status(200).json({
        message: "Otp verified & Admin logged In successfully",
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