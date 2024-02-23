import GlobalService from "../../services/global/global.services.js";

export const getDailyHoroscope = async (req, res) => {
  try {
    res.status(200).json({
      user: user,
      success: true,
      message: "Fetched user data successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
