const router = require('express').Router()
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')
const User = require('../models/User')
const Post = require('../models/Post')
const sharp = require('sharp')

//create new post
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        //create an object with description as request body
        const postObj = {
            description: req.body.description
        }

        //add user Id from auth
        postObj.userId = req.user._id

        //if image is uploaded, add image to the post
        if (req.file) {
            const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 300 }).png().toBuffer()
            postObj.image = buffer
        }

        //create and save new post
        const post = new Post(postObj)
        await post.save()
        res.status(201).send(post)
    } catch (err) {
        res.status(400).send(err.messsage)
    }
})


module.exports = router