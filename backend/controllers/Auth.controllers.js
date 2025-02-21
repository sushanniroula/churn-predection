const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper')
const client = require('../helpers/init_redis')

module.exports = {
    register: async(req, res, next) => {
        try {
            // const { email, password } = req.body
            const result = await authSchema.validateAsync(req.body)
    
            // if(!email || !password ) throw createError.BadRequest()
            
            const doesExist = await User.findOne({ email: result.email })
            if(doesExist) throw createError.Conflict(`${result.email} is already been registered`)
            const user = new User(result)
            const savedUser = await user.save()
            
            const accessToken = await signAccessToken(savedUser.id)
            const refreshToken =  await signRefreshToken(savedUser.id)
            res.send({ accessToken, refreshToken })
    
    
            
    
        } catch (error) {
            if(error.isJoi == true) error.status = 422
            next(error)
        }
    },

    login: async(req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body)
            const user = await User.findOne({email: result.email})
            if(!user) throw createError.NotFound("User not registered")
            
            const isMatched = await user.isValidPassword(result.password)
            if (!isMatched) throw createError.Unauthorized("Username/Password not valid")
            
            const accessToken = await signAccessToken(user.id)
            const refreshToken =  await signRefreshToken(user.id)
            res.send({accessToken, refreshToken, user})
        } catch (error) {
            if(error.isJoi == true) return next(createError.BadRequest("Invalid username/password"))
            next(error)
        }
    },

    refreshToken: async(req, res, next) => {
        try {
            const { refreshToken } = req.body
            if(!refreshToken) throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)
            const accessToken = await signAccessToken(userId)
            const refToken = await signRefreshToken(userId)
            res.send({accessToken: accessToken, refreshToken: refToken})
        } catch (error) {
            next(error)
        }
    },

    logout: async(req, res, next) => {
        try {
            const {refreshToken} = req.body
            if(!refreshToken) throw createError.BadRequest()
            
            const userId = await verifyRefreshToken(refreshToken)
            const result = await client.DEL(userId, (err, value) => {
                if(err){
                    console.log(err.message)
                    throw createError.InternalServerError()
                }
            })
    
            if(result) {
                res.sendStatus(204)
            }

    
        } catch (error) {
            next(error)
        }
    }
}