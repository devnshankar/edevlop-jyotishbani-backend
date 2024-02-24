import { prismaClient } from "../../database/client.database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class AstrologerService {
  static generateOtp() {
    // Generate a random 6-digit number
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpstring = otp.toString();
    return otpstring;
  }

  static async getAstrologer(phoneNumber) {
    try {
      const astrologer = await this.findAstrologerByPhoneNumber(phoneNumber);
      return astrologer;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async updateOtp(phoneNumber, otp, Astrologer) {
    try {
      const astrologer = await prismaClient.astrologer.update({
        where: { phoneNumber },
        data: {
          otp: otp,
          phoneNumber: Astrologer.phoneNumber,
          createdAt: Astrologer.createdAt,
          updatedAt: Astrologer.updatedAt,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async checkAstrologerExistance(phoneNumber) {
    try {
      const astrologer = await prismaClient.astrologer.findUnique({
        where: { phoneNumber },
      });
      return astrologer;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async findAstrologerByPhoneNumber(phoneNumber) {
    try {
      const astrologer = await prismaClient.astrologer.findUnique({
        where: { phoneNumber },
      });
      return astrologer;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async verifyOtp(phoneNumber, otp) {
    try {
      const astrologer = await this.findAstrologerByPhoneNumber(phoneNumber);

      if (astrologer.otp !== otp) {
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

  static async createAstrologer(phoneNumber) {
    try {
      const astrologer = await prismaClient.astrologer.create({
        data: {
          phoneNumber: phoneNumber,
        },
      });
      return astrologer;
    } catch (error) {
      console.log(error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  static async deleteAstrologer(phoneNumber) {
    try {
      const astrologer = await prismaClient.astrologer.delete({
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

  static async updateAstrologer(body) {
    try {
      const {
        name,
        email,
        gender,
        status,
        image,
        short_bio,
        city,
        country,
        phoneNumber,
      } = body;
      console.log(JSON.stringify(body, null , 2))
      const updationTime = new Date().toISOString();
      const astrologer = await prismaClient.astrologer.update({
        where: {
          phoneNumber,
        },
        data: {
          name: name,
          email: email,
          gender: gender,
          status: status,

          short_bio: short_bio,
          image: image,
          country: country,
          city: city,
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

export default AstrologerService;
