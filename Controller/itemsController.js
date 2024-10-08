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
            let id = req.params.id;  // Use id from params
            const updatedItem = await Item.update(req.body, { where: { item_id: id } });
            if (updatedItem[0] === 0) {
                throw createError(404, "Item is unavailable");
            }
            res.status(200).json(updatedItem);
        } catch (error) {
            next(error);
        }
    },

    deleteItem: async (req, res, next) => {
        try {
        const itemId = req.params.id;
        await Item.destroy({ where: { item_id: itemId } });
        res.status(200).json({ message: 'Item deleted successfully' });
        } catch (error) {
        next(error);
        }
    },
    makeSale: async (req, res, next) => {
        try {
            const { name, price_Ksh } = req.body; // Using name and price_Ksh for the sale
            const itemInstance = await Item.findOne({ where: { name } }); // Find item by name
            if (!itemInstance) {
                throw createError(404, "Item not found");
            }

            if (itemInstance.quantity <= 0) {
                throw createError(400, "Insufficient quantity available");
            }

            // Update total sales
            await Item.increment('total_sales', { by: price_Ksh, where: { name } });

            // Deduct one from quantity
            await Item.decrement('quantity', { by: 1, where: { name } });

            // Generate receipt
            const receipt = {
                item: itemInstance.name,
                quantity: 1, // As we are decrementing by one per sale
                totalPrice: price_Ksh,
                message: "Thank you for shopping with us, come again next time" // Added message
            };

            // Send the receipt as a response
            res.status(200).json(receipt);
        } catch (error) {
            next(error);
        }
    }
};
