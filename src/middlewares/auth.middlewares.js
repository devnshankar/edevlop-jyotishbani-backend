import AuthService from "../services/auth-middleware/auth.services.js";
import UserService from "../services/user/user.services.js";

const auth = async (req, res, next) => {
  try {
    // get the refresh token from the request headers
    let refreshToken = req.headers.referer;
    // get the access token from the request headers
    let accessToken = req.headers.authorization;

    // if refreshToken is not present then proceed as usual wih only accessToken
    if (!refreshToken) {
      // if no access token return unauthorized user
      if (!accessToken) {
        res.status(401).json({
          status: false,
          message: "Unauthorized request !!!",
          ERROR_CODE: 3501,
        });

      }
      // if access token present then
      else if (accessToken){
        // verify the access token
        accessToken = accessToken.split(" ")[1];
        const decodedAccessToken = AuthService.decodeJWTToken(accessToken);
        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decodedAccessToken.exp < currentTime) {
          res.status(401).json({
            status: false,
            message:
              "Token expired. Please use refresh token to get a new access token.",
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


    // if refresh Token present then validate the token
    else if (refreshToken) {
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
      }
      // if accessToken is present along with refreshtoken
      else if (accessToken) {
        // verify accesstoken validity
        accessToken = accessToken.split(" ")[1];
        const decodedAccessToken = AuthService.decodeJWTToken(accessToken);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        // if access token valid
        if (decodedAccessToken.exp > currentTime) {
          // then do not assign new access token proceed with the existing one
          // destructure the phonenumber from the refresh token and append it to the req.body
          req.body = {
            ...req.body,
            phoneNumber: decodedAccessToken.phoneNumber,
          };
          // next() for further actions
          next();
        }
      } else {
        // if access token absent or invalid and refresh token is present and valid
        // destructure the phonenumber from the refresh token and append it to the req.body
        req.body = {
          ...req.body,
          phoneNumber: decodedRefreshToken.phoneNumber,
        };
        // generate new accessToken
        const accessToken = await UserService.generateToken(
          decodedRefreshToken.phoneNumber,
          "6h"
        );
        // send the new accessToken through cookies
        res.cookie("accessToken", accessToken, { httpOnly: true });
        // proceed with actions
        next();
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: false,
        message: "Internal Server Error",
        ERROR_CODE: 3401,
      });
  }
};

export default auth;
