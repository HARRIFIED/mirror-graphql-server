const postsResolvers = require('./Posts');
const userResolvers = require('./User');
const CommentsResolvers = require('./Comments');
const User = require('../../models/User')


module.exports = {
    Posts: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },
    User: {
        async followers(parent) {
            const followers = parent.followers.map(res => res + "")
            console.log("foll", followers)
            const users = await User.find();             
            return users.filter(f => followers.includes(f.id))
        },
        async following(parent) {
            const following = parent.following.map(res => res + "")
            const users = await User.find();             
            return users.filter(f => following.includes(f.id))
        },
        followingCount: (parent) => parent.following.length,
        followersCount: (parent) => parent.followers.length
    }, 
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...CommentsResolvers.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription,
    }
}