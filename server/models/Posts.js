const { model, Schema } = require('mongoose');

const PostsSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: String 
}
);

module.exports = model('Posts', PostsSchema)