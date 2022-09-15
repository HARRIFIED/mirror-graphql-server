// const { ApolloServer } = require('apollo-server');
const { ApolloServer } = require('apollo-server-express');
const { PubSub } =  require('graphql-subscriptions');
require('colors');
const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');


const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

dotenv.config();

const port = process.env.PORT || 5000;

const pubsub = new PubSub();

// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context: ({ req }) => ({ req, pubsub }),
// });

// connectDB().then(() => {
//     server.listen(PORT).then(res => {
//         console.log(`Server listening on port ${res.url}`.cyan.underline)
//     })
// });

async function startApolloServer() {

  const app = express();
 
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req, pubsub }),
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/'
  });

  // Modified server startup
  await new Promise (resolve => {
    connectDB().then().then(() => {httpServer.listen({ port }, resolve)})
  });
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`.cyan.underline);

}

startApolloServer(); //start the server