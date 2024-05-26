const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { id: userId };
        const secret = process.env.ACCESS_TOKEN_SECRET; // Ensure this is set
        const options = {
            expiresIn: '1h',
            issuer: 'yourdomain.com',
            audience: userId.toString(),
        };

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.error('JWT Sign Error:', err);
                return reject(createError.InternalServerError('Token generation failed'));
            }
            resolve(token);
        });
    });
};

const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { id: userId };
        const secret = process.env.REFRESH_TOKEN_SECRET; // Ensure this is set
        const options = {
            expiresIn: '7d',
            issuer: 'yourdomain.com',
            audience: userId.toString(),
        };

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.error('JWT Refresh Sign Error:', err);
                return reject(createError.InternalServerError('Refresh token generation failed'));
            }
            resolve(token);
        });
    });
};

module.exports = { signAccessToken, signRefreshToken };
