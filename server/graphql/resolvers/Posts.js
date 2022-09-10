const Posts = require('../../models/Posts');

module.exports = {
    Query: {
        async getPosts() {
            try{
                const posts = await Posts.find();
                return posts
            } catch(err) {
                throw new Error('unable to fetch posts at the moments')
            }
        }
    }
}