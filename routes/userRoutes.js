const express = require("express");
const userController = require('../controller/userController');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

router.post('/addUser',  userController.addUser);
router.get("/getAllUsers", userController.getAllUsers);
router.put("/updateUser/:id",  userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);
router.post('/loginUser', userController.loginUser);
router.post('/registerAdmin', userController.registerAdmin);
router.post('/loginAdmin', userController.loginAdmin);


module.exports = router;