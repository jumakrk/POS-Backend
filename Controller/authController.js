const db = require('../Model/dbConnect');

const User = db.users;

module.exports = {
    addUser: async (req, res, next) => {
        try {
        const { email, password } = await authSchema.validateAsync(req.body);
        const exists = await User.findOne({ where: { email } });
        if (exists) {
            throw createError.Conflict(`${email} has already been registered`);
        }
        const newUser = new User({ email, password });
        const savedUser = await newUser.save();
    
          const accessToken = await signAccessToken(savedUser.id); // Assuming ID is accessible directly
        res.status(200).send({ accessToken });
        } catch (error) {
        console.log(error);
        if (error.isJoi === true) error.status = 422;
        next(error);
        }
    },
// http methods
//get users from db
getAllUsers: [isAdmin, async (req, res, next) => {
    try {
    const users = await User.findAll({});
    res.status(200).send(users);
    } catch (error) {
    next(error);
    }
}],

}