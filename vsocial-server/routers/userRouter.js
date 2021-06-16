const { Router } = require('express')
const auth = require('../middleware/auth')

const router = Router()

//get profile
router.get('/self', auth, async (req, res) => {
    res.status(200).send(req.user)
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

module.exports = router