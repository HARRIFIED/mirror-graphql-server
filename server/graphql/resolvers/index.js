const postsResolvers = require('./Posts');
const userResolvers = require('./User');
const CommentsResolvers = require('./Comments');

module.exports = {
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