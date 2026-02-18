import CategoryService from "./category.service.js";
import { success, error } from "../../utils/response.js";

export const createCategory = async (req, res) => {
  try {
    const id = await CategoryService.create(req.body);
    return success(res, "Category created", { id });
  } catch (err) {
    return error(res, err.message);
  }
};

export const getCategories = async (req, res) => {
  try {
    const data = await CategoryService.findAll();
    return success(res, "Categories fetched", data);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const data = await CategoryService.findById(req.params.id);
    if (!data) return error(res, "Category not found", 404);
    return success(res, "Category fetched", data);
  } catch (err) {
    return error(res, err.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updated = await CategoryService.update(
      req.params.id,
      req.body
    );
    if (!updated) return error(res, "Category not found", 404);
    return success(res, "Category updated");
  } catch (err) {
    return error(res, err.message);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleted = await CategoryService.delete(req.params.id);
    if (!deleted) return error(res, "Category not found", 404);
    return success(res, "Category deleted");
  } catch (err) {
    return error(res, err.message);
  }
};
