import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {
  static decodeJWTToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }

  static async generateToken(phoneNumber, duration) {
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign({ phoneNumber }, jwtSecret, { expiresIn: duration });
    return token;
  }
}

export default AuthService;
