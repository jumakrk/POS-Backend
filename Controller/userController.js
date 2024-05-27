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
            const { username, email, password } = await registerSchema.validateAsync(req.body);

            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) {
                throw createError.Conflict(`${email} has already been registered`);
            }

            const usernameExists = await User.findOne({ where: { username } });
            if (usernameExists) {
                throw createError.Conflict(`${username} has already been taken`);
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ username, email, password: hashedPassword });

            const accessToken = await signAccessToken(newUser.id);

            res.status(201).send({ accessToken });
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

            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw createError.NotFound("User not registered");
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw createError.Unauthorized('Invalid Email or Password');
            }

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
            const { email, password } = await registerSchema.validateAsync(req.body);
            const exists = await User.findOne({ where: { email } });
            if (exists) {
                throw createError.Conflict(`${email} has already been registered`);
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = await User.create({ email, password: hashedPassword, role: 'admin' });
            const accessToken = await signAccessToken(newAdmin.id);
            res.status(201).send({ accessToken });
        } catch (error) {
            if (error.isJoi === true) error.status = 422;
            next(error);
        }
    },

    loginAdmin: async (req, res, next) => {
        try {
            const { email, password } = await loginSchema.validateAsync(req.body);
            const admin = await User.findOne({ where: { email, role: 'admin' } });

            if (!admin) {
                throw createError.NotFound("Admin not registered");
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                throw createError.Unauthorized('Invalid Email or Password');
            }

            const accessToken = await signAccessToken(admin.id);
            const refreshToken = await signRefreshToken(admin.id);

            res.send({ accessToken, refreshToken });
        } catch (error) {
            if (error.isJoi === true) {
                return next(createError.BadRequest('Invalid Email or Password'));
            }
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

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            res.status(200).send({ message: 'Password reset and updated successfully' });
        } catch (error) {
            next(error);
        }
    },
};
