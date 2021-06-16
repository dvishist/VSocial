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

const post = mongoose.model('Post', postSchema)

module.exports = post