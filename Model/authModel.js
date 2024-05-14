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

// Before creating a new user, hash the password
    user.beforeCreate(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
    });

      //   Compare the incoming password with the stored password
      user.prototype.isValidPassword = async function (password) {
        try {
            return  await bcrypt.compare(password, this.password);
        } catch (error) {
            throw  error;
        }
    };
    return user;
}