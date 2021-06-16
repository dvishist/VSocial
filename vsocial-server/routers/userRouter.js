const { Router } = require('express')
const auth = require('../middleware/auth')
const User = require('../models/User')

const router = Router()

//get self profile
router.get('/self', auth, async (req, res) => {
    res.status(200).send(req.user)
})

//get other users' profile
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
    const allowed = ['username', 'email', 'password', 'password', 'isAdmin']
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

//follow a user
router.patch('/:id/follow', auth, async (req, res) => {
    const currentUser = req.user
    try {
        //find the user to be followed
        const followedUser = await User.findById(req.params.id)

        //if the relation already exists or if the ids are same, return an error
        if (currentUser.following.includes(req.params.id) || followedUser.followers.includes(currentUser._id.toString()) || currentUser._id.toString() == req.params.id)
            return res.status(400).send('Cannot process the follow operation')

        //add currentUser to the list of followed user's followers
        followedUser.followers.push(String(currentUser._id.toString()))
        //add followedUser to the list of current user's following
        currentUser.following.push(req.params.id)

        //save users
        await followedUser.save()
        await currentUser.save()

        res.status(200).send(currentUser)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//unfollow a user
router.patch('/:id/unfollow', auth, async (req, res) => {
    const currentUser = req.user
    try {
        //find the user to be unfollowed
        const unfollowedUser = await User.findById(req.params.id)

        //remove current user as follower and followed user as following
        currentUser.following = currentUser.following.filter(userId => userId !== req.params.id)
        unfollowedUser.followers = unfollowedUser.followers.filter(userId => userId !== currentUser._id.toString())

        //save users
        await unfollowedUser.save()
        await currentUser.save()

        res.status(200).send(currentUser)
    } catch (err) {
        res.status(400).send(err.message)
    }
})


module.exports = router