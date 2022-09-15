const postsResolvers = require('./Posts');
const userResolvers = require('./User');
const CommentsResolvers = require('./Comments');

module.exports = {
    Posts: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
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