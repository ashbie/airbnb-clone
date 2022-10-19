import { IResolvers } from "@graphql-tools/utils";
import {  Google } from "../../../lib/api";
import {  DatabaseCollection, Listing, User } from "../../../lib/types";
import { ListingArgs, ListingBookingsData, ListingBookingsArgs, ListingsArgs, ListingsData, ListingsFilter, ListingsQuery } from "./types"
import {  authorize } from "../../../lib/utils";
import { Request } from "express";
import { ObjectId } from "mongodb";


export const listingResolvers: IResolvers = {
  Query: {
    listing: async (_root: undefined, { id } : ListingArgs , { db, req } : { db: DatabaseCollection; req: Request }): Promise<Listing> => {
      try {
        const listing = await db.listings.findOne({ _id: new ObjectId(id) });
        if (!listing) {
          throw new Error("l'annonce est introuvable");
        }

        const viewer = await authorize(db, req);
        if (viewer && viewer._id === listing.host) {
          listing.authorized = true;
        }

        return listing;
      } catch (error) {
        throw new Error(`Échec de la requête de l'annonce: ${error}`);
      }
      
    },
    listings: async (_root: undefined, { location, filter, limit, page }: ListingsArgs, { db }: { db: DatabaseCollection }) => {
      try {
        const query: ListingsQuery = {};
        const data: ListingsData = {
          region: null,
          total: 0,
          result: []
        };

        if(location) {
          const { country, admin, city } = await Google.geocode(location);

          if (city) query.city = city;
          if (admin) query.admin = admin;
          if (country) {
            query.country = country;
          } else {
            throw new Error("Aucun pays trouvé");
          }

          const cityText = city ? `${city}, ` : "";
          const adminText = admin ? `${admin}, ` : "";
          data.region = `${cityText}${adminText}${country}`;
          console.log(`\n\t\t data.region=${data.region} \n\t\t query.country=${query.country} \n \t\t query=${query} \n  ` );
        }

        let cursor = location? await db.listings.find({...query}) : await db.listings.find({});

        data.total = await cursor.count();

        if( filter && filter === ListingsFilter.PRICE_LOW_TO_HIGH ) {
          cursor = cursor.sort({ price: 1 });
        }

        if( filter && filter === ListingsFilter.PRICE_HIGH_TO_LOW ) {
          cursor = cursor.sort({ price: -1 });
        }

        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        
        data.result = await cursor.toArray();

        return data;
    } catch (error) {
        throw new Error(`Échec de la requête des listes  ( Failed to query listings ): ${error}`);
    }
    }
  },
  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toString();
    },
    host: async (
      listing: Listing,
      _args: Record<string, never>,
      { db }: { db: DatabaseCollection }
    ): Promise<User> => {
      const host = await db.users.findOne({ _id: listing.host });
      if (!host) {
        throw new Error("l'hôte est introuvable");
      }
      return host;
    },
    bookingsIndex: (listing: Listing): string => {
      return JSON.stringify(listing.bookingsIndex);
    },
    bookings: async (
      listing: Listing,
      { limit, page }: ListingBookingsArgs,
      { db }: { db: DatabaseCollection }
    ): Promise<ListingBookingsData | null> => {
      try {
        if (!listing.authorized) {
          return null;
        }

        const data: ListingBookingsData = {
          total: 0,
          result: []
        };

        let cursor = await db.bookings.find({
          _id: { $in: listing.bookings }
        });

        data.total = await cursor.count();

        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        
        data.result = await cursor.toArray();

        return data;

      } catch (error) {
        throw new Error(`Échec de la requête des réservations d'annonces: ${error}`);
      }
    }
  }
};
  