const db = require("../Model/dbConnect");
const createHttpError = require("http-errors");
const { authSchema } = require('../Helpers/validateSchema');
const { signAccessToken, signRefreshToken } = require('../Helpers/jwtHelper');
const user = db.user; // Assuming user is your model

module.exports = {
    addUser: async (req, res, next) => {
        try {
            const { email, password } = await authSchema.validateAsync(req.body);
            const exists = await user.findOne({ where: { email } });
            if (exists) {
                throw createHttpError.Conflict(`${email} has already been registered`);
            }
            const newUser = await user.create({ email, password });
            const accessToken = await signAccessToken(newUser.user_id);
            res.status(201).json({ accessToken });
        } catch (error) {
            console.error(error);
            if (error.isJoi === true) error.status = 422;
            next(error);
        }
    },

    getAllUsers: async (req, res, next) => {
        try {
            const allUsers = await user.findAll({});
            res.status(200).json(allUsers);
        } catch (error) {
            next(error);
        }
    },

    getUser: async (req, res, next) => {
        try {
            const id = req.params.id;
            const getUser = await user.findOne({ where: { user_id: id } });
            if (!getUser) {
                throw createHttpError(404, "User not found");
            }
            res.status(200).json(getUser);
        } catch (error) {
            next(error);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const id = req.params.id;
            const updatedUser = await user.update(req.body, { where: { user_id: id } });
            if (!updatedUser) {
                throw createHttpError(404, "User not found");
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    },

    loginUser: async (req, res, next) => {
        try {
            const { email, password } = await authSchema.validateAsync(req.body);
            const foundUser = await user.findOne({ where: { email } });

            if (!foundUser) {
                throw createHttpError.NotFound('User not registered');
            }

            const isMatch = await foundUser.isValidPassword(password);
            if (!isMatch) {
                throw createHttpError.Unauthorized('Invalid credentials');
            }

            const accessToken = await signAccessToken(foundUser.id);
            const refreshToken = await signRefreshToken(foundUser.id);

            res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            if (error.isJoi === true) {
                next(createHttpError.BadRequest('Invalid credentials'));
            } else {
                next(error);
            }
        }
    }
};