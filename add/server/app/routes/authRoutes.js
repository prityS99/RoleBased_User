const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");
const checkPermission = require("../middleware/permissionMiddleware");
const authCheck = require("../middleware/authMiddleware");


router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/admin/dashboard",authCheck,checkPermission("admin_dashboard"),
authController.adminDashboard);

router.get("/dashboard",authCheck,authController.dashboard);

router.get("/users",authCheck,checkPermission("read_users"),authController.getUsers);

module.exports = router;