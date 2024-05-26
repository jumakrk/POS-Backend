const dashboardModel = require('../model/dashboardModel');

exports.getAllItems = (req, res) => {
    const items = dashboardModel.getAllItems();
    res.json(items);
};

exports.getItemById = (req, res) => {
    const { id } = req.params;
    const item = dashboardModel.getItemById(id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
};

exports.createItem = (req, res) => {
    const newItem = req.body;
    const item = dashboardModel.createItem(newItem);
    res.status(201).json(item);
};

exports.updateItem = (req, res) => {
    const { id } = req.params;
    const updatedItem = req.body;
    const item = dashboardModel.updateItem(id, updatedItem);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
};

exports.deleteItem = (req, res) => {
    const { id } = req.params;
    const success = dashboardModel.deleteItem(id);
    if (success) {
        res.json({ message: 'Item deleted successfully' });
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
};