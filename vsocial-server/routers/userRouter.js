const { Router } = require('express')
const auth = require('../middleware/auth')
const User = require('../models/User')

const router = Router()

//get self profile
router.get('/self', auth, async (req, res) => {
    res.status(200).send(req.user)
})

//get others profile
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).send(user)
    } catch (err) {
        res.status(404).send(err.message)
    }
})

//update profile
router.patch('/self', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['username', 'email', 'password', 'followers', 'following', 'password', 'isAdmin']
    const isAllowed = updates.every(update => allowed.includes(update))
    if (!isAllowed) return res.status(400).send({ error: 'Cannot add invalid updates!' })
    try {
        const user = req.user
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        res.status(200).send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//delete user
router.delete('/self', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(204).send()
    } catch (err) {
        res.status(500).send(err.message)
    }
})


module.exports = router