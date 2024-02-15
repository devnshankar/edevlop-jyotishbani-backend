import AdminService from "../../services/admin/admin.services.js";

export const getAdmin = async (req, res) => {
  try {
    // get the phone number from the request body
    const { phoneNumber } = req.body;
    // send get request to database
    const admin = await AdminService.getAdmin(phoneNumber);
    // return user
    res.status(200).json({
      admin: admin,
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
      const accessToken = await AdminService.generateToken(phoneNumber, "6h");
      const refreshToken = await AdminService.generateToken(phoneNumber, "3d");
      // Set tokens as cookies
      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      // return the auth token to the req sender
      return res.status(200).json({
        message: "Otp verified & Admin logged In successfully",
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

export const updateAdmin = async (req, res) => {
  try {
    // make a prisma client admin updation request to the database
    console.log(req.body)
    const Admin = await AdminService.updateAdmin(req.body);
    // return the updated admin data
    console.log(Admin);
    return res.status(201).json({ admin: Admin });
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
        .status(201)
        .json({ message: "Admin deleted successfully", success: true });
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

