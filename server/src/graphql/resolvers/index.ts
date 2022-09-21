import merge from "lodash.merge";
//import { listingsResolvers } from "./listings";
import { viewerResolvers } from "./Viewer";

export const resolvers = merge(viewerResolvers);