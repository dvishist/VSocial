const router = require('express').Router()
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')
const Post = require('../models/Post')
const sharp = require('sharp')
const jo = require('jpeg-autorotate')

//create new post
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        //create an object with description
        const postObj = {
            userId: req.user._id,
            description: req.body.description
        }

        //if image is uploaded, add image to the post
        if (req.file) {
            try {
                const rotated = await jo.rotate(req.file.buffer)
                const buffer = await sharp(rotated.buffer).resize({ width: 300, height: 300 }).png().toBuffer()
                postObj.image = buffer
            } catch (err) {
                console.log(err)
            }
        }

        //create and save new post
        const post = new Post(postObj)
        await post.save()
        res.status(201).send(post)
    } catch (err) {
        res.status(400).send(err.messsage)
    }
})

//get post
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).send(post)
    } catch (err) {
        res.status(404).send('Post Not Found')
    }
})

//get all posts by userId
router.get('/all/:id', auth, async (req, res) => {
    try {
        const posts = await Post.find({
            userId: req.params.id
        })
        if (posts)
            res.status(200).send(posts)
        else
            throw new Error('No Posts Found')
    } catch (err) {
        res.status(404).send(err.message)
    }
})

//update post
router.patch('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        //find post by id
        const post = await Post.findById(req.params.id)

        //add description if exists
        if (req.body.description) post.description = req.body.description

        //if image is uploaded, add/overwrite image to the post
        if (req.file) {
            const buffer = await sharp(req.file.buffer).resize({ width: 500, height: 500 }).png().toBuffer()

            post.image = buffer
        }

        await post.save()
        res.status(200).send(post)
    } catch (err) {
        res.status(400).send(err.messsage)
    }
})

//delete post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) res.status(404).send('Post Not Found')
        if (post.userId !== req.user._id.toString())
            res.status(401).send('Cannot delete Post belonging to another user')
        post.remove()
        res.status(204).send()
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//like a post
router.patch('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //add or remove like by checking
        if (!post.likes.includes(req.user._id.toString()))
            post.likes.push(req.user._id.toString())
        else {
            post.likes = post.likes.filter(id => id !== req.user._id.toString())
        }
        await post.save()
        res.status(200).send(post)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//get image
router.get('/:id/image', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) throw new Error('Post Not Found')
        if (!post.image) throw new Error('Image Not Found')
        res.set('Content-Type', 'image/png')
        res.send(post.image)
    } catch (err) {
        res.status(404).send(err.message)
    }
})

module.exports = router