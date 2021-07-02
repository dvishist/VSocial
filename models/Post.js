const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    description: {
        type: String,
        require: true,
        max: 500
    },
    image: {
        type: Buffer
    },
    likes: {
        type: Array,
        default: []
    }
},
    {
        timestamps: true
    }
)

//filter sensitive data before sending JSON
postSchema.methods.toJSON = function () {
    const post = this.toObject()
    delete post.image
    return post
}

const post = mongoose.model('Post', postSchema)

module.exports = post