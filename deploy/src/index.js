"use strict";
/*import dotenv = require('dotenv');
dotenv.config();
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const index_1 = require("./database/index");
const compression_1 = __importDefault(require("compression"));
const graphql_1 = require("./graphql");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const post_1 = require("./post");
const mount = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, index_1.connectDatabase)();
    app.use((0, cookie_parser_1.default)(process.env.SECRET));
    app.use((0, compression_1.default)());
    app.get("/*", (_req, res) => res.sendFile(`${__dirname}/client/index.html`));
    const server = new apollo_server_express_1.ApolloServer({ typeDefs: graphql_1.typeDefs, resolvers: graphql_1.resolvers, context: ({ req, res }) => ({ db, req, res }) });
    server.start().then(() => __awaiter(void 0, void 0, void 0, function* () {
        server.applyMiddleware({ app, path: '/api' });
        app.post('/mocky', (_req, res) => { res.send(post_1.mocky); });
        app.listen(process.env.PORT);
        console.log(`[server-app] http://localhost:${process.env.PORT}/api`);
    }));
});
mount((0, express_1.default)());
