const postsResolvers = require('./Posts');
const userResolvers = require('./User');

module.exports = {
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation
    }
}