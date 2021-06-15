import express from "express"
const app = express()
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'

dotenv.config()

const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is running on Port: ', port)
})