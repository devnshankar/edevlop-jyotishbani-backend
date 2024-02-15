import AuthService from "../services/auth-middleware/auth.services.js";
import UserService from "../services/user/user.services.js";

const auth = async (req, res, next) => {
  try {
    let accessToken = req.headers.authorization;
    let refreshToken = req.headers.refresh;

    if (!refreshToken) {
      // if refreshToken absent then return unauthorized user
      if (!accessToken) {
        res.status(401).json({ message: "Unauthorized User" });
      } else {
        // if accessToken  present then proceed for validation
        accessToken = accessToken.split(" ")[1];
        let decodedAccessToken = AuthService.decodeJWTToken(accessToken);
        // if token expired return auth failed
        if (!decodedAccessToken) {
          res.status(401).json({ message: "Unauthorized User" });
        }
        // if token verified then proceed for action
        else {
          req.body = {
            ...req.body,
            phoneNumber: decodedAccessToken.phoneNumber,
          };
          next();
        }
      }
    }
    // if refreshToken present
    else {
      refreshToken = refreshToken.split(" ")[1];
      let decodedRefreshToken = AuthService.decodeJWTToken(refreshToken);
      // if refresh token expired return res to login again
      if (!decodedRefreshToken) {
        res.status(400).json({ message: "Token expired Please login again" });
      }
      // if refresh token valid
      else {
        // if refreshToken present
        let newAccessToken = AuthService.generateToken(
          decodedRefreshToken.phoneNumber,
          "6h"
        );
        res.cookie("accessToken", newAccessToken, { httpOnly: true });
        res.status(200).json({
          message: "New accessToken assigned successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default auth;

// const auth = async (req, res, next) => {
//   try {
//     let accessToken = req.headers.authorization;
//     if(!accessToken){
//       res.status(401).json({
//         success: false,
//         message: "No accessToken provied"
//       })
//     }
//     else {
//       accessToken = accessToken.split(" ")[1];
//       let decodedAccessToken = AuthService.decodeJWTToken(accessToken);

//       // if decoded accesstoken is expired then send the response to resend the refresh token
//       if (tokenexpired) {
//         res.status(401).json({
//           success: false,
//           message: "Access Token expired please send the refresh token"
//         })
//       }
//       else{
//         if (decodedAccessToken) {
//         req.body = { ...req.body, phoneNumber: decodedAccessToken.phoneNumber };
//         next();
//       }
//     }
//     } else {
//       res.status(401).json({ message: "Unauthorized User" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export default auth;

// // Token is expired
//         let refreshToken = req.headers.refresh;
//         if (refreshToken) {
//           refreshToken = refreshToken.split(" ")[1];
//           let decodedRefreshToken = AuthService.decodeJWTToken(refreshToken);
//           const phoneNumber = decodedRefreshToken.phoneNumber;
//           if (decodedRefreshToken) {
//             // Refresh token is valid
//             const accessToken = await UserService.generateToken(
//               phoneNumber,
//               "6h"
//             );
//             res.cookie("accessToken", accessToken, { httpOnly: true });
//             res.status(401).json({
//               message: "New Access Token Assigned",
//             });
//           } else {
//             // Refresh token is expired
//             res.status(401).json({
//               message: "Please try logging in again with your phone.",
//             });
//           }
//         } else {
//           res.status(401).json({ message: "Unauthorized User" });
//         }
