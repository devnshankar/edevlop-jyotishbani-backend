import AuthService from "../services/auth-middleware/auth.services.js";
import UserService from "../services/user/user.services.js";

const auth = async (req, res, next) => {
  try {
    // get the access token from the request headers
    let accessToken = req.headers.authorization;

    // if no access token present return unauthorized request
    if (!accessToken) {
      res.status(401).json({
        status: false,
        message: "Unauthorized request !!!",
        ERROR_CODE: 3501,
      });
    }
    // if access token present then
    else {
      // Split the access token and Bearer
      accessToken = accessToken.split(" ")[1];
      const decodedAccessToken = AuthService.decodeJWTToken(accessToken);

      // if no decodedAccessToken present then 
      if (!decodedAccessToken) {
        res.status(401).json({
          status: false,
          message: "Unauthorized request !!!",
          ERROR_CODE: 3501,
        });
      } else {
        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decodedAccessToken.exp < currentTime) {
          res.status(401).json({
            status: false,
            message:"Token expired. Please use refresh token to get a new access token.",
            ERROR_CODE: 3502,
          });
        } else {
          // Token is not expired, proceed with actions
          // and yes destructure the phonenumber from the token and append it to the req.body
          req.body = {
            ...req.body,
            phoneNumber: decodedAccessToken.phoneNumber,
          };
          next();
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      ERROR_CODE: 3401,
    });
  }
};

export default auth;
