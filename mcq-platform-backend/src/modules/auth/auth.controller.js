import * as authService from "./auth.service.js";
import { success, error } from "../../utils/response.js";

export const sendOtp = async (req, res) => {
  try {
    await authService.sendOtp(req.body.email);
    return success(res, "OTP sent successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const verifyOtpAndRegister = async (req, res) => {
  try {
    await authService.verifyOtpAndRegister(req.body);
    return success(res, "Registration successful");
  } catch (err) {
    return error(res, err.message);
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    return success(res, "Login successful", data);
  } catch (err) {
    return error(res, err.message);
  }
};
