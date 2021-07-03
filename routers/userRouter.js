const router = require('express').Router()
const auth = require('../middleware/auth')
const User = require('../models/User')
const Post = require('../models/Post')
const upload = require('../middleware/upload')
const sharp = require('sharp')
const jo = require('jpeg-autorotate')


//get all users
router.get('/all', auth, async (req, res) => {
    try {
        const users = await User.find({})
        const results = users.map(user => ({
            id: user._id,
            username: user.username
        }))
        res.status(200).send(results)
    } catch (err) {
        res.status(400).send(err)
    }
})

//get self profile
router.get('/self', auth, async (req, res) => {
    res.status(200).send(req.user)
})

//get feed
//NO PAGINATION IMPLEMENTED YET!!! SENDS ALL EXISTING POSTS
router.get('/feed', auth, async (req, res) => {
    try {
        const user = req.user

        //retrieve list of posts made by following users
        let posts = await Promise.all(
            user.following.map(async id => await Post.find({ userId: id }))
        )

        if (!posts) res.status(404).send("No Posts Found")

        //convert multiple arrays into 1 
        posts = posts.reduce((newArray, array) => newArray.concat(array), [])
        //get self posts
        const selfPosts = await Post.find({ userId: user._id.toString() })
        let allPosts = [...selfPosts, ...posts]
        //sort by latest
        allPosts = allPosts.sort((post1, post2) => post2.createdAt - post1.createdAt)
        allPosts.length = 5
        res.status(200).send(allPosts)
    } catch (err) {
        res.status(400).send(err.message)
    }
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

//upload Profile/Cover Picture
router.post('/:pictureType', auth, upload.single('image'), async (req, res) => {
    const user = req.user
    const dimensions = req.params.pictureType === 'profilePicture' ? [500, 500] : [900, 290]
    const [width, height] = dimensions

    try {
        const rotated = await jo.rotate(req.file.buffer)
        const buffer = await sharp(rotated.buffer).resize({ width, height }).png().toBuffer()
        user[req.params.pictureType] = buffer
        await user.save()
        res.status(201).send(user)
    } catch (err) {
        if (err.message === 'No orientation tag found in EXIF') {
            const buffer = await sharp(req.file.buffer).resize({ width, height }).png().toBuffer()
            user[req.params.pictureType] = buffer
            await user.save()
            res.status(201).send(user)
        } else
            res.status(400).send(err.message)
    }
})

//get profile/Cover Picture
router.get('/:id/:pictureType', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) throw new Error('User Not Found')
        if (!user[req.params.pictureType]) throw new Error('Image Not Found')
        res.set('Content-Type', 'image/png')
        res.send(user[req.params.pictureType])
    } catch (err) {
        res.status(404).send(err.message)
    }
})

//update profile
router.patch('/self', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['username', 'email', 'password', 'description', 'isAdmin']
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
            return res.status(403).send('Cannot process the follow operation')

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