const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const client = require('./init_redis')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options ={
                expiresIn: "1y",
                issuer: "domainurl.com",
                audience: userId
            }

            JWT.sign(payload, secret, options, (err, token) => {
                if(err){
                    reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },

    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err){
                // if(err.name == 'JsonWebTokenError'){
                //     return next(createError.Unauthorized())
                // }else{
                //     return next(createError.Unauthorized(err.message))
                // }
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }   
            req.payload = payload
            next()
        })
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options ={
                expiresIn: "1y",
                issuer: "domainurl.com",
                audience: userId
            }

            JWT.sign(payload, secret, options, (err, token) => {
                if(err){
                    reject(createError.InternalServerError())
                }

                client.SET(userId, token, {
                    EX: 365 * 24 * 60 * 60
                }, (err, reply)=>{
                    if(err){
                        reject(createError.InternalServerError())
                        return
                    }
                })
                resolve(token)
            })
        })
    },
    verifyRefreshToken: async (refreshToken) => {
        try {
            // Step 1: Verify the JWT token
            const payload = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const userId = payload.aud;  // Extract userId from JWT payload
    
            // Step 2: Fetch the refresh token from Redis for the userId
            const result = await client.GET(userId);
    
            // Step 3: Compare the provided refresh token with the one stored in Redis
            if (refreshToken === result) {
                return userId;  // Tokens match, return userId
            }
    
            // Tokens don't match, throw Unauthorized error
            throw createError.Unauthorized();
            
        } catch (err) {
            // Catch any errors, including JWT verification or Redis errors
            if (err.name === 'JsonWebTokenError') {
                throw createError.Unauthorized();  // JWT verification failed
            }
            throw createError.InternalServerError();  // Redis or other internal error
        }
    }
    
    
}
    