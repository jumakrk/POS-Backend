module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('items', {
        item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        price_Ksh: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        total_sales: { // field to track total sales
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });
    return Item;
};