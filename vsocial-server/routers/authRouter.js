const { Router } = require('express')
const User = require('../models/User')

const router = Router()

router.post('/register', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(200).send(user)
    } catch (err) {
        res.send(err.message)
    }
})

module.exports = router