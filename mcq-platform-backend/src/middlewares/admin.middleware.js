export const adminOnly = (req, res, next) => {
  const user = req.user;

  if (!user || user.type !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Invalid admin role",
    });
  }

  next();
};
