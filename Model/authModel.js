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

         // Before validating the user, convert email to lowercase
user.beforeValidate((user, options) => {
    if (user.email) {
    user.email = user.email.toLowerCase();
    }
});
}