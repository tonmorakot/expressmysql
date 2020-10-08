const express = require("express");
const router = express.Router();

const controller = require("../controller/userController");

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", controller.insert);
router.put("/", controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;
