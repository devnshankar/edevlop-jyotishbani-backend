import { prismaClient } from "../../database/client.database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class AdminService {
  static generateOtp() {
    // Generate a random 6-digit number
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpstring = otp.toString();
    return otpstring;
  }

  static async getAdmin(phoneNumber) {
    try {
      const admin = await this.findAdminByPhoneNumber(phoneNumber);
      return admin;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async updateOtp(phoneNumber, otp, Admin) {
    try {
      const admin = await prismaClient.admin.update({
        where: { phoneNumber },
        data: {
          otp: otp,
          phoneNumber: Admin.phoneNumber,
          createdAt: Admin.createdAt,
          updatedAt: Admin.updatedAt,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async checkAdminExistance(phoneNumber) {
    try {
      const admin = await prismaClient.admin.findUnique({
        where: { phoneNumber },
      });
      return admin;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async findAdminByPhoneNumber(phoneNumber) {
    try {
      const admin = await prismaClient.admin.findUnique({
        where: { phoneNumber },
      });
      return admin;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async verifyOtp(phoneNumber, otp) {
    try {
      const admin = await this.findAdminByPhoneNumber(phoneNumber);
      if (admin.otp !== otp) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async generateToken(phoneNumber, duration) {
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign({ phoneNumber }, jwtSecret, { expiresIn: duration });
    return token;
  }

  static async createAdmin(phoneNumber) {
    try {
      const admin = await prismaClient.admin.create({
        data: {
          phoneNumber: phoneNumber,
        },
      });
      return admin;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async deleteAdmin(phoneNumber) {
    try {
      const admin = await prismaClient.admin.delete({
        where: {
          phoneNumber: phoneNumber,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async updateAdmin(body) {
    try {
      const {
        firstname,
        lastname,
        email,
        gender,
        phoneNumber
      } = body;
      const updationTime = new Date().toISOString();
      const astrologer = await prismaClient.admin.update({
        where: {
          phoneNumber,
        },
        data: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          gender: gender,
          updatedAt: updationTime,
        },
      });
      return astrologer;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }
}

export default AdminService;
