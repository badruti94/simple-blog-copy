const jwt = require('jsonwebtoken')

const mustRole = (role) => (req, res, next) => {
    try {
        const authorizationHeader = req.header('Authorization')
        if (!authorizationHeader) {
            const error = new Error('No token found')
            error.errorCode = 401
            throw error
        }

        const token = authorizationHeader.replace('Bearer ', '')

        const secretKey = process.env.SECRET_KEY || 'secret'
        const decoded = jwt.verify(token, secretKey)

        if (decoded.role != role && role != 'all') {
            const error = new Error('User forbidden')
            error.errorCode = 403
            throw error
        }

        req.userId = decoded.userId
        req.role = decoded.role
        next()
    } catch (error) {
        const errorCode = error.errorCode || 500
        const message = error.message

        res.status(errorCode).send({ message })
    }
}

module.exports = { mustRole }