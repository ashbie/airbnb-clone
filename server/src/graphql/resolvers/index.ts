import merge from "lodash.merge";
//import { listingsResolvers } from "./listings";
import { viewerResolvers } from "./Viewer";
import { userResolvers } from "./User";
import { listingResolvers } from "./Listing";
import { bookingResolvers } from "./Booking";

export const resolvers = merge(viewerResolvers, userResolvers, listingResolvers, bookingResolvers);