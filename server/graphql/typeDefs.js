const gql = require('graphql-tag');

module.exports = gql`
    type Posts {
        id: ID!
        body: String
        createdAt: String!
        username: String!
    }

    type User{
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
    }
`;