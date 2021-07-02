const express = require("express")
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
dotenv.config()

const userRouter = require('./routers/userRouter')
const authRouter = require('./routers/authRouter')
const postRouter = require('./routers/postRouter')

const port = process.env.PORT

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}, () => {
    console.log("Connected to MongoDB")
})

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))
app.use(cors())

//routers
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)

//client
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
} else {
    app.get('/', (req, res) => {
        res.send('API')
    })
}


app.listen(port, () => {
    console.log('Server is running on Port: ', port)
})