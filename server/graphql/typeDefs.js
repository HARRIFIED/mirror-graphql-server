const gql = require('graphql-tag');

module.exports = gql`
    type Posts {
        id: ID!
        body: String
        createdAt: String!
        username: String!
        comments: [Comments]!
        likes: [Likes]!
        likeCount: Int!
        commentCount: Int!
    }

    type Comments {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
    }

    type Likes {
        id: ID!
        username: String!
        createdAt: String!
    }

    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    input RegisterInput {
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    type Query {
        getPosts: [Posts]
        getPost(postID: ID!): Posts
    }
    
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!): Posts!
        deletePost(postID: ID!): String!
        createComment(postID: ID! body: String!): Posts!
        deleteComment(postID: ID! commentID: String!): Posts!
        likePost(postID: ID!): Posts!
    }

    
    type Subscription {
        newPost: Posts!
        likeCounts: Posts!
    }
`;