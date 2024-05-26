const express = require("express")
const itemsController = require ("../controller/itemsController");
const { verifyAccessToken } = require('../helpers/jwthelpers');
const isAdmin = require('../middleware/isAdmin');
const  router=express.Router();

router.post("/addItem", itemsController.addItem);
router.get("/getAllItems", itemsController.getAllItems);
router.get("/getItem/:item_id", itemsController.getItem);
router.patch("/updateItem/:id", itemsController.updateItem);
router.post("/makeSale", itemsController.makeSale);


module.exports=router;