const express = require("express")
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')

const userRouter = require('./routers/userRouter')
const authRouter = require('./routers/authRouter')

dotenv.config()

const port = process.env.PORT

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}, () => {
    console.log("Connected to MongoDB")
})

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

//routers
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)

app.listen(port, () => {
    console.log('Server is running on Port: ', port)
})