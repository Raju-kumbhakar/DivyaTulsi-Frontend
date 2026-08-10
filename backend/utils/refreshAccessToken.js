const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "User is not verified",
      });
    }

    const newAccessToken = generateAccessToken(
      user._id
    );

    return res.status(200).json({
      accessToken: newAccessToken,
    });

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};