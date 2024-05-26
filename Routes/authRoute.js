const express = require("express");
const authController = require('../controller/authController');
// const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

router.post('/addUser',  authController.addUser);
// router.get("/getAllUsers", authController.getAllUsers);
// router.put("/updateUser/:id",  authController.updateUser);
// router.delete("/deleteUser/:id", authController.deleteUser);
// router.post('/loginUser', authController.loginUser);
// router.post('/registerAdmin', authController.registerAdmin);
// router.post('/loginAdmin', authController.loginAdmin);

module.exports = router;