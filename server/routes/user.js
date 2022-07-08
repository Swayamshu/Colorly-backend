const express = require("express");
const { UserController } = require("../controllers");

const router = express.Router();

router.get("/profile", UserController.getProfile);
router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;