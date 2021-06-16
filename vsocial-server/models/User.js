const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Invalid Email')
        }
    },
    password: {
        type: String,
        reuqired: true,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},
    {
        timestamps: true
    }
)

//hash passwords before saving to database
userSchema.pre('save', async function (next) {
    const userSchema = this
    userSchema.password = userSchema.isModified('password') ? await bcrypt.hash(userSchema.password, 8) : userSchema.password
    next()
})

//filter sensitive data before sending JSON
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

//find user by credentials
userSchema.statics.findByCredentials = async function (email, password) {
    const userSchema = this
    const user = await userSchema.findOne({ email })
    if (!user) throw new Error('Incorrect email or password')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Incorrect email or password')
    return user
}

//generate token, save to tokens list and give back to the client 
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens.push({ token })
    await user.save()
    return token
}

const user = mongoose.model('User', userSchema)

module.exports = user