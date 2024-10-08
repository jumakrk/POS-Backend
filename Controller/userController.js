const db = require('../model/dbConnect');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const { registerSchema, loginSchema } = require('../helpers/validateSchema');
const { signAccessToken, signRefreshToken } = require('../helpers/jwthelpers');
const isAdmin = require('../middleware/isAdmin');

const User = db.users;

module.exports = {
    addUser: async (req, res, next) => {
        try {
            // Extract username, email, and password from the request body
            const { username, email, password } = await  registerSchema.validateAsync(req.body);
    
            // Check if the email already exists in the database
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) {
                throw createError.Conflict(`${email} has already been registered`);
            }
    
            // Check if the username already exists in the database
            const usernameExists = await User.findOne({ where: { username } });
            if (usernameExists) {
                throw createError.Conflict(`${username} has already been taken`);
            }
    
            // Create a new user instance with the provided data
            const newUser = new User({ username, email, password });
    
            // Save the new user to the database
            const savedUser = await newUser.save();
    
            // Generate an access token for the user (assuming you have a function for this)
            const accessToken = await signAccessToken(savedUser.id);
    
            // Send the access token in the response
            res.status(200).send({ accessToken });
        } catch (error) {
            console.error(error);
            if (error.isJoi === true) error.status = 422;
            next(error);
        }
    },
    
getAllUsers: [isAdmin, async (req, res, next) => {
    try {
    const users = await User.findAll({});
    res.status(200).send(users);
    } catch (error) {
    next(error);
    }
}],
updateUser: async (req, res, next) => {
    try {
    const userId = req.params.id;
    const userData = req.body;
    
    if (req.user.role !== 'admin') {
        throw createError.Unauthorized('Only admins can update users.');
    }

    await User.update(userData, { where: { id: userId } });
    res.status(200).send({ message: 'User updated successfully' });
    } catch (error) {
    next(error);
    }
},
deleteUser: async (req, res, next) => {
    try {
    const userId = req.params.id;
    
    if (req.user.role !== 'admin') {
        throw createError.Unauthorized('Only admins can delete users.');
    }

    await User.destroy({ where: { id: userId } });
    res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
    next(error);
    }
},
loginUser: async (req, res, next) => {
    try {
        const { email, password } = await loginSchema.validateAsync(req.body);

        // Find user by email in the database
        const user = await User.findOne({ where: { email } });

        // If user doesn't exist, return error
        if (!user) {
            throw createError.NotFound("User not registered");
        }

        // Verify password
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            throw createError.Unauthorized('Invalid Email or Password');
        }

        // If password is correct, generate tokens
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.send({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        if (error.isJoi === true) {
            return next(createError.BadRequest('Invalid Email or Password'));
        }
        next(error);
    }
},

registerAdmin: async (req, res, next) => {
    try {
    const { email, password } = await authSchema.validateAsync(req.body);
    const exists = await User.findOne({ where: { email } });
    if (exists) {
        throw createError.Conflict(`${email} has already been registered`);
    }
    const newAdmin = new User({ email, password, role: 'admin' });
    const savedAdmin = await newAdmin.save();

      const accessToken = await signAccessToken(savedAdmin.id); // Assuming ID is accessible directly
    res.status(200).send({ accessToken });
    } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
    }
},
loginAdmin: async (req, res, next) => {
    try {
    const result = await authSchema.validateAsync(req.body);
    const admin = await User.findOne({ where: { email: result.email, role: 'admin' } });
    
    if (!admin)
        throw createError.NotFound("Admin not registered");
    
      // Matching the password
    const isMatch = await admin.isValidPassword(result.password);
    if (!isMatch)
        throw createError.Unauthorized('Invalid Email or Password');

      // If password matches then generate token
    const accessToken = await signAccessToken(admin.id);
    const refreshToken = await signRefreshToken(admin.id);
    
    res.send({ accessToken, refreshToken });
    } catch (error) {
    if (error.isJoi === true)
        return next(createError.BadRequest('Invalid Email or Password'));
    next(error);
    }
},

resetAndUpdatePassword: async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw createError.NotFound('User not found');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password with the hashed password
        user.password = hashedPassword;
        await user.save();

        res.status(200).send({ message: 'Password reset and updated successfully' });
    } catch (error) {
        next(error);
    }
},
};