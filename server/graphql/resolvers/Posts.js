const Posts = require('../../models/Posts');
const checkAuth = require('../../utils/checkAuth');
const { AuthenticationError, UserInputError } = require('apollo-server');
const { PubSub } =  require('graphql-subscriptions');

const pubsub = new PubSub();

module.exports = {
    Query: {
        async getPosts() {
            try{
                const posts = await Posts.find().sort({createdAt: -1})
                return posts
            } catch(err) {
                throw new Error('unable to fetch posts at the moments')
            }
        },

        async getPost(_, {postID}) {
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
            pubsub.publish('NEW_POSTS', {
                newPost: post
            })
            return post;
        },

        async deletePost(_, {postID}, context) {
            const user = checkAuth(context);

            try {
                const post = await Posts.findById(postID);

                if (!post) {
                    return "Post doesn't exist"
                }
                
                if (user.username === post.username) {
                    await post.delete();
                    return 'Posts sucesssfully deleted'
                } else {
                    throw new AuthenticationError ("Action not allowed", {
                        error: "Action not allowed"
                    });
                }
            } catch (err) {
                throw new Error(`Something went wrong ${err}`)
            }
        },
        async likePost(_, {postID}, context) {
            const {username} = checkAuth(context);
            
            const post = await Posts.findById(postID);

            if (!post) {
                throw new UserInputError('Post does not exist')
            }

            if (post.likes.find(like => like.username === username)) {
                //post already liked, so we unlike it
                post.likes = post.likes.filter(like => like.username !== username)
            } else {
                //post not liked yet, so we like it
                post.likes.unshift({
                    username,
                    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
                })
            }

            await post.save();                                                                                                                         
            return post
        }
    },
    Subscription: {
        newPost: {
            // subscribe: (_, __, {pubsub}) => pubsub.asyncIterator('NEW_POSTS')
            subscribe: () => pubsub.asyncIterator('NEW_POSTS'),
        }
    }
}