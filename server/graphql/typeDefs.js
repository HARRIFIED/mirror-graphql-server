const gql = require('graphql-tag');

module.exports = gql`
    type Posts {
        id: ID!,
        body: String,
        createdAt: String!,
        username: String!,
    }

    type User{
        id: ID!,
        username: String!,
        email: String!,
        token: String!,
        username: String!,
        createdAt: String!
    }

    input RegisterInput {
        username: String!,
        email: String!,
        password: String!,
        confirmPassword: String!
    }

    type Query {
        getPosts: [Posts]
    }
    type Mutation {
        register(registerInput: RegisterInput): User
    }
`;