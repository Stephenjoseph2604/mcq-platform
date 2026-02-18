import * as attemptService from "./attempt.service.js";
import { success, error } from "../../utils/response.js";

export const startQuiz = async (req, res) => {
  try {
    const data = await attemptService.startQuiz(req.body);
    return success(res, "Quiz started", data);
  } catch (err) {
    console.error(err);
    return error(res, err.message || "Unable to start quiz");
  }
};
