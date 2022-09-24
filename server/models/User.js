const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String ,
    following: [
        {
        
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    followers: [
        {
            
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}
);

module.exports = model('User', UserSchema)