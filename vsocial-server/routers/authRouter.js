const { Router } = require('express')
const User = require('../models/User')

const router = Router()

//creates a new user
router.post('/register', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(200).send(user)
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

router.post('/logout', async () => {
    try {

    } catch (err) {

    }
})

module.exports = router