import { gql } from "apollo-server-express";

export const typeDefs = gql`

input LogInInput {
    code: String!
}

type Viewer{
    id: String
    token: String
    avatar: String
    hasWallet: Boolean
    didRequest: Boolean!
}

type Query{
    authUrl: String!
}

type Mutation{
    logIn(input: LogInInput ): String!
    logOut: String!
}

`;