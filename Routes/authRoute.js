const express = require('express');
const authController = require('../Controller/authController');
const router = express.Router();

router.post("/addUser", authController.addUser)
router.post("/loginUser", authController.loginUser)
router.get("/getAllUsers", authController.getAllUsers)
router.get("/getUser/:id", authController.getUser)
router.patch("/updateUser/:id", authController.updateUser)
module.exports = router;