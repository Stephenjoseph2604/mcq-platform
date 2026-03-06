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

export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return error(res, "Email is required");
    }

    await AdminService.sendAdminOtp(email);
    return success(res, "OTP sent successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    await AdminService.verifyOtpAndCreateAdminRequest(req.body);
    return success(res, "Admin request submitted successfully");
  } catch (err) {
    return error(res, err.message);
  }
};


export const approveController = async (req, res) => {
  try {
    const requestId = req.params.id;
console.log('hi');

    await AdminService.approveAdminRequest(requestId);
    return success(res, "Admin approved successfully");
  } catch (err) {
    return error(res, err.message);
  }
};


export const rejectController = async (req, res) => {
  try {
    const requestId = req.params.id;

    await AdminService.rejectAdminRequest(requestId);
    return success(res, "Admin request rejected successfully");
  } catch (err) {
    return error(res, err.message);
  }
};


export const activateController = async (req, res) => {
  try {
    const adminId = req.params.id;

    await AdminService.activateAdmin(adminId);
    return success(res, "Admin activated successfully");
  } catch (err) {
    return error(res, err.message);
  }
};


export const deactivateController = async (req, res) => {
  try {
    const adminId = req.params.id;

    await AdminService.deactivateAdmin(adminId);
    return success(res, "Admin deactivated successfully");
  } catch (err) {
    return error(res, err.message);
  }
};


export const deleteController = async (req, res) => {
  try {
    const adminId = req.params.id;

    await AdminService.deleteAdmin(adminId);
    return success(res, "Admin deleted successfully");
  } catch (err) {
    return error(res, err.message);
  }
};


export const getAllAdminsController = async (req, res) => {
  try {
    const admins = await AdminService.getAllAdmins();
    return success(res, "Admins fetched successfully", admins);
  } catch (err) {
    return error(res, err.message);
  }
};


export const getAllAdminRequestsController = async (req, res) => {
  try {
    const requests = await AdminService.getAllAdminRequests();
    return success(res, "Admin requests fetched successfully", requests);
  } catch (err) {
    return error(res, err.message);
  }
};


export const getPendingAdminRequestsController = async (req, res) => {
  try {
    const requests = await AdminService.getPendingAdminRequests();
    return success(res, "Pending admin requests fetched successfully", requests);
  } catch (err) {
    return error(res, err.message);
  }
};