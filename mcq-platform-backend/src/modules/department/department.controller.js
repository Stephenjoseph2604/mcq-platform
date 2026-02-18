import DepartmentService from "./department.service.js";
import { success, error } from "../../utils/response.js";

export const createDepartment = async (req, res) => {
  try {
    const id = await DepartmentService.create(req.body);
    return success(res, "Department created", { id });
  } catch (err) {
    return error(res, err.message);
  }
};

export const getDepartments = async (req, res) => {
  try {
    const data = await DepartmentService.findAll();
    return success(res, "Departments fetched", data);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const data = await DepartmentService.findById(req.params.id);
    if (!data) return error(res, "Department not found", 404);
    return success(res, "Department fetched", data);
  } catch (err) {
    return error(res, err.message);
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const updated = await DepartmentService.update(
      req.params.id,
      req.body
    );
    if (!updated) return error(res, "Department not found", 404);
    return success(res, "Department updated");
  } catch (err) {
    return error(res, err.message);
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const deleted = await DepartmentService.delete(req.params.id);
    if (!deleted) return error(res, "Department not found", 404);
    return success(res, "Department deleted");
  } catch (err) {
    return error(res, err.message);
  }
};
