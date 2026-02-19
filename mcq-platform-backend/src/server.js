import dotenv from "dotenv";
dotenv.config();
import db from "./config/db.js";
import app from "./app.js";
import { createDefaultSuperAdmin } from "./modules/admin/admin.service.js";

const PORT = process.env.PORT || 5000;

db.query("SELECT 1")
  .then(() => console.log("✅ MySQL connected"))
  .catch(err => console.error("❌ MySQL error", err.message));

 createDefaultSuperAdmin();

app.listen(PORT, () => {
  
  
  console.log(`Server running on port ${PORT}`);
});
 