// itemsController.js
const db = require('../model/dbConnect');
const Item = db.items;
const createError = require('http-errors');

module.exports = {
    addItem: async (req, res, next) => {
        try {
            let info = {
                name: req.body.name,
                quantity: req.body.quantity,
                price_Ksh: req.body.price_Ksh,
            };
            const addedItem = await Item.create(info);
            res.status(201).json(addedItem);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    getAllItems: async (req, res, next) => {
        try {
            let items = await Item.findAll({});
            res.status(200).json(items);
        } catch (error) {
            next(error);
        }
    },
    getItem: async (req, res, next) => {
        try {
            let id = req.params.item_id;
            let itemFound = await Item.findByPk(id);
            if (!itemFound) {
                throw createError(404, "Item is unavailable");
            }
            res.status(200).json(itemFound);
        } catch (error) {
            next(error);
        }
    },
    updateItem: async (req, res, next) => {
        try {
            let id = req.params.item_id;
            const updatedItem = await Item.update(req.body, { where: { item_id: id } });
            if (updatedItem[0] === 0) {
                throw createError(404, "Item is unavailable");
            }
            res.status(200).json(updatedItem);
        } catch (error) {
            next(error);
        }
    },
    makeSale: async (req, res, next) => {
        try {
            const { item_id, quantity } = req.body;
            const itemInstance = await Item.findByPk(item_id);
            if (!itemInstance) {
                throw createError(404, "Item not found");
            }
            if (itemInstance.quantity < quantity) {
                throw createError(400, "Insufficient quantity available");
            }
    
            // Deduct the quantity of items
            await Item.decrement('quantity', { by: quantity, where: { item_id: item_id } });
    
            // Calculate total price
            const totalPrice_Ksh = itemInstance.price_Ksh * quantity;
    
            // Update total sales
            await Item.increment('total_sales', { by: quantity, where: { item_id: item_id } });
    
            // Generate receipt
            const receipt = {
                item: itemInstance.name,
                quantity,
                totalPrice: totalPrice_Ksh,
                message: "Thank you for shopping with us, come again next time" // Added message
                // Add more fields as needed
            };
    
            // Send the receipt as a response
            res.status(200).json(receipt);
        } catch (error) {
            next(error);
        }
    }
};