const jwt = require("jsonwebtoken");

const User = require("../models/user");

const userAuthCheck = async (req, res, next) => {
  try {
    const accessToken = req.cookies.userAccessToken;

    const refreshToken = req.cookies.userRefreshToken;

    // No tokens
    if (!accessToken && !refreshToken) {
      return res.redirect("/login");
    }

    // 1️⃣ Try access token
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        return next();
      } catch (error) {
        // Don't return yet — fallback to refresh token
      }
    }

    // 2️⃣ Use refresh token
    if (!refreshToken) {
      return res.redirect("/login");
    }

    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
      );

      const user = await User.findById(decodedRefresh.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.redirect("/login");
        }

      // 🔁 Generate new access token
      const newAccessToken = jwt.sign(
        {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" },
      );

      res.cookie("userAccessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      req.user = {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return next();
    } catch (error) {
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.redirect("/login");
  }
};

module.exports = userAuthCheck;