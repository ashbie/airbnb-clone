import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./graphql";


const app = express();
const port = 3000;

const server = new ApolloServer({ schema });
server.start().then(() => {
    server.applyMiddleware({app, path: '/api'});

    app.listen(port);

    console.log(`[app]: http://localhost:${port}/api`);
});
