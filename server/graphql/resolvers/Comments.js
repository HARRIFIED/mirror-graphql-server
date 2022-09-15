const { AuthenticationError, UserInputError } = require('apollo-server');

const Posts = require('../../models/Posts');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
    Mutation: {
        async createComment(_, {postID, body}, context) {
            //check user is authenticated
            const {username} = checkAuth(context);

            const post = await Posts.findById(postID);
            if (body.trim() === '') {
                throw new UserInputError('Empty Comments not allowed', {
                    errors: 'Empty Comments not allowed'
                })
            } 

            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
                })

                await post.save();
                return post;
            } else {
                throw new UserInputError('Posts does not exists', {
                    errors: "Posts does not exists"
                })
            }
        },
        async deleteComment(_, {postID, commentID}, context) {
            //check user is authenticated
            const {username} = checkAuth(context);

            const post = await Posts.findById(postID);
            const commentIndex = post.comments.findIndex(c => c.id === commentID);
            
            if (!post.comments[commentIndex]) {
                throw new UserInputError('Comment does not exists')
            }

            if (post) {
                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1)
                    await post.save();
                    return post
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } else {
                throw new UserInputError('Post does not exists')
            }
        }
    }
}