const router = require('express').Router()
const User = require('../models/User')
const auth = require('../middleware/auth')

//creates a new user
router.post('/register', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//returns an object with user profile and a jwt token
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(202).send({ user, token })
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//logs out the user, removes the current token from the tokens list
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(tokenObj => tokenObj.token !== req.token)
        await req.user.save()
        res.status(204).send()
    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router