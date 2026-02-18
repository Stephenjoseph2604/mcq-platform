export const success = (res, message, data = null) => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

export const error = (res, message) => {
  return res.status(400).json({
    success: false,
    message
  });
};
