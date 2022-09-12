const Posts = require('../../models/Posts');
const checkAuth = require('../../utils/checkAuth')

module.exports = {
    Query: {
        async getPosts() {
            try{
                const posts = await Posts.find()
                return posts
            } catch(err) {
                throw new Error('unable to fetch posts at the moments')
            }
        },

        async getPost(parent, {postID}) {
            try{
                const post = await Posts.findById(postID);
                if (post) {
                    return post
                } else {
                    throw new Error('Posts with id not found')
                }
            } catch (err) {
                throw new Error('Something went wrong')
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) { // _ also means parent
            const user = checkAuth(context);

            const newPost = new Posts({
                body,
                username: user.username,
                id: user.id,
                createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
            })

            const post = newPost.save();
            return post;
        }
    }
}