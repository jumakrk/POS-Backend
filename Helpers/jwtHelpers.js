const JWT = require ('jsonwebtoken');
const createError = require ('http-errors');
// const user = require ('../Model/userModel');

module.exports = {
  signAccessToken: (UserId) => {
    return new Promise ((resolve, reject) =>{
      const payload = {UserId}
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn:'10m',
        issuer: 'JumaKariuki',
        audience: UserId.toString()
      }
      JWT.sign(payload, secret, options, (error, token)=> {
        if(error) {
          console.log(error.message)
          reject(createError.message)
        }
        resolve(token)
      })
    })
  },

  verifyAccessToken: (req, res, next)=> {
    if(!req.headers['authorization']) return next (createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    JWT.verify(token, process.env.Access_Token_SECRET, (err, payload)=>{
      if(err){
        if(err.name === 'JsonWebTokenError'){
          return next(createError.Unauthorized())
        }else{
          return next(createError.Unauthorized(err.message))
        }
      }
      req.payload = payload
      next()
    })
  },

  signRefreshToken: (UserId)=>{
    return new Promise ((resolve, reject)=>{
      const payload = {}
      const secret = process.env.Refresh_Token_SECRET;
      const options = {
        expiresIn:'1y',
        issuer: 'JumaKariuki',
        audience: UserId.toString()
      }
      JWT.sign(payload, secret, options, (error, token)=>{
        if(error) {
          console.log (error.message)
          reject(createError.InternalServerError())
        }
        resolve (token);
      })
    })
  },

  verifyRefreshToken: (req, res, next)=> {
    if(!req.headers['authorization']) return next (createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    JWT.verify(token, process.env.Refresh_Token_SECRET, (err, payload)=>{
      if(err){
        if(err.name === 'JsonWebTokenError'){
          return next(createError.Unauthorized())
        }else{
          return next(createError.Unauthorized(err.message))
        }
      }
      req.payload = payload
      next()
    })
  },
}