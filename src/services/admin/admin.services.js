import { prismaClient } from "../../database/client.database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class AdminService {
  static generateOtp() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpstring = otp.toString();
    return otpstring;
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

  static async generateToken(phoneNumber) {
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign({ phoneNumber }, jwtSecret, { expiresIn: "1d" });
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
}

export default AdminService;
