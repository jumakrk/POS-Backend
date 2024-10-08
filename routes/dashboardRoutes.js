const express = require('express');
const dashboardController = require('../controller/dashboardController');
const router = express.Router();

router.get('/', dashboardController.getAllItems);
router.get('/:id', dashboardController.getItemById);
router.post('/', dashboardController.createItem);
router.put('/:id', dashboardController.updateItem);
router.delete('/:id', dashboardController.deleteItem);

module.exports = router;
