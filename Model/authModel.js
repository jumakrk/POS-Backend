const bcrypt = require('bcrypt');
module.exports=(sequelize, DataTypes) =>{
    const user = sequelize.define('users', {

        email:{
            type: DataTypes.STRING,
            allowNull: false,
        },  
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },  
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user'
        }      
    });

}