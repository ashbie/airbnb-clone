/*
================================================
This is from the demo: Part 1  -- Not for production
================================================
*/
import { IResolvers } from "@graphql-tools/utils";
import { ObjectId } from "mongodb";
import { DatabaseCollection, Listing } from "../../../lib/types";

export const listingsResolvers: IResolvers = {
    Query: {
        listings: async (_root: undefined, _args: object , { db }: { db: DatabaseCollection } ): Promise<Listing[]> => {
            
            return await db.listings.find({}).toArray();
        }
    },

    Mutation: {
        deleteListing: async (_root: undefined, { id }: { id: string }, { db }: { db: DatabaseCollection } ): Promise<Listing> => {
            const deleteResult = await db.listings.findOneAndDelete({ _id : new ObjectId(id)});

            if(!deleteResult.value){ throw new Error('[deleteListing] : failed to delete listing!!!'); }
            return deleteResult.value;
        }
    },

    Listing: {
        id: (listing: Listing): string => { return listing._id.toString(); }
    }
}
