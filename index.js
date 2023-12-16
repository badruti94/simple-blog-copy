require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const fileUpload = require('express-fileupload')
const routes = require('./src/routes')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(fileUpload())

app.use('/v1/', routes)

app.use((error, req, res, next) => {
    const errorCode = error.errorCode || 500
    const message = error.message
    const data = error.data

    if (error.name === 'SequelizeUniqueConstraintError') {
        errorCode = 400
        message = error.errors[0].message
    }

    res.status(errorCode).send({ message, data })
})

const port = process.env.PORT || 4000
app.listen(port, console.log(`Listening on port ${port}`))