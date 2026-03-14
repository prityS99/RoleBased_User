const express = require("express");
const checkPermission = require("../middleware/permissionMiddleware");
const authCheck = require("../middleware/authMiddleware");
const recordController = require("../controller/recordController");
const router = express.Router();

router.post(
  "/create",
  authCheck,
  checkPermission("create_record"),
  recordController.createRecord
);

router.get(
  "/",
  authCheck,
  checkPermission("read_record"),
  recordController.getAllRecords
);

router.get(
  "/:id",
 authCheck,
  checkPermission("read_record"),
  recordController.getRecordById
);

router.put(
  "/:id",
  authCheck,
  checkPermission("update_record"),
  recordController.updateRecord
);

router.delete(
  "/:id",
  authCheck,
  checkPermission("delete_record"),
  recordController.deleteRecord
);

module.exports = router;