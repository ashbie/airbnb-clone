import dotenv = require('dotenv');
dotenv.config();

import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database/index";
import { typeDefs, resolvers } from "./graphql";
import cookieParser from 'cookie-parser';

import { mocky } from "./post"

/** The cvDeploy branch has been made so that Ashbie can deploy the project before adding all the features.
 *  I'm doing this because I want to showcase/display the project on my CV and Portfolio website/webapp.
 */

const mount = async (app: Application) => {
    const db = await connectDatabase();

    app.use(cookieParser(process.env.SECRET));

    const server = new ApolloServer({ typeDefs, resolvers, context: ({ req, res}) => ({ db, req, res }) });
    server.start().then(async () => {

        server.applyMiddleware({app, path: '/api'});

        app.post('/mocky', (_req, res) => { res.send(mocky)});

        app.listen(process.env.PORT);

        console.log(`[server-app] http://localhost:${process.env.PORT}/api`);

    });
}

mount(express());