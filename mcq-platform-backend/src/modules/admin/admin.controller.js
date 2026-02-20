import * as AdminService from "./admin.service.js";
import { success ,error} from "../../utils/response.js";
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, "Email and password are required", 400);
    }

    const result = await AdminService.loginAdmin(email, password);

    return success(res, result, "Admin login successful");
  } catch (err) {
    console.error("Admin Login Error:", err);
    return error(res, err.message || "Login failed", err.statusCode || 500);
  }
}; 


export const getAdminMetaData = async (req, res) => {
  try {
    const metaData = await AdminService.fetchAdminMetaData();
    return success(res, metaData, "Admin metadata fetched successfully");
  } catch (err) {
    console.error("Admin Meta Error:", err);
    return error(res, "Failed to fetch admin metadata", 500);
  }
};