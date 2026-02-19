


export const superAdminOnly = (req, res, next) => {
  const user = req.user;

  if (!user || user.type !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  if (user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "SUPER_ADMIN access only",
    });
  }

  next();
};
