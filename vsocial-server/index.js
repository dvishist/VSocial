import express from "express"
const app = express()
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'

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

app.get('/', (req, res) => {
    res.status(200).send('Hello World')
}

app.listen(port, () => {
    console.log('Server is running on Port: ', port)
})