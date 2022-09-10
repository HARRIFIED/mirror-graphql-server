const { ApolloServer } = require('apollo-server');
require('colors');
const dotenv = require('dotenv');


const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
    typeDefs,
    resolvers
});

connectDB().then(() => {
    server.listen(PORT).then(res => {
        console.log(`Server listening on port ${res.url}`.cyan.underline)
    })
});