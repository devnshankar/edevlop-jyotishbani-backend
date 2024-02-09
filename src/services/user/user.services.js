import { prismaClient } from "../../database/client.database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class UserService {
  static generateOtp() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpstring = otp.toString();
    return otpstring;
  }

  static async updateOtp(phoneNumber, otp, User) {
    try {
      const user = await prismaClient.user.update({
        where: { phoneNumber },
        data: {
          otp: otp,
          phoneNumber: User.phoneNumber,
          createdAt: User.createdAt,
          updatedAt: User.updatedAt,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async checkUserExistance(phoneNumber) {
    try {
      const user = await prismaClient.user.findUnique({
        where: { phoneNumber },
      });
      return user;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async findUserByPhoneNumber(phoneNumber) {
    try {
      const user = await prismaClient.user.findUnique({
        where: { phoneNumber },
      });
      return user;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async verifyOtp(phoneNumber, otp) {
    try {
      const user = await this.findUserByPhoneNumber(phoneNumber);
      if (user.otp !== otp) {
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

  static async createUser(phoneNumber) {
    try {
      const user = await prismaClient.user.create({
        data: {
          phoneNumber: phoneNumber,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }
}

export default UserService;
