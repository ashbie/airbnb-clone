import { IResolvers } from "@graphql-tools/utils";
import {  Google } from "../../../lib/api";
import {  DatabaseCollection, Listing, User, ListingType } from "../../../lib/types";
import { ListingArgs, ListingBookingsData, ListingBookingsArgs, ListingsArgs, ListingsData, ListingsFilter, ListingsQuery, HostListingArgs, HostListingInput } from "./types"
import {  authorize } from "../../../lib/utils";
import { Request } from "express";
import { ObjectId } from "mongodb";

const verifyHostListingInput = ({title, description, type, price}: HostListingInput) => {
  if (title.length > 100) { throw new Error("Le titre de l'annonce doit comporter moins de 100 caractères"); }
  if (description.length > 5000) {
    throw new Error("la description de l'annonce doit comporter moins de 5000 caractères");
  }
  if (type !== ListingType.Apartment && type !== ListingType.House) {
    throw new Error("listing type must be either an apartment or house");
  }
  if (price < 0) {
    throw new Error("price must be greater than 0");
  }
};

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
  Mutation: {
    hostListing: async (_root:undefined, { input }: HostListingArgs, { db, req }: { db: DatabaseCollection; req: Request }): Promise<Listing> => {
      verifyHostListingInput(input);

      const viewer = await authorize(db, req);
      if (!viewer) {
        throw new Error("l'utilisateur introuvable");
      }

      const { country, admin, city } = await Google.geocode(input.address);
      if (!country || !admin || !city) {
        throw new Error("entrée d'adresse invalide");
      }

      const insertResult = await db.listings.insertOne({
        _id: new ObjectId(),
        ...input,
        bookings: [],
        bookingsIndex: {},
        country,
        admin,
        city,
        host: viewer._id
      });

      const insertedListingId: ObjectId = insertResult.insertedId;

      await db.users.updateOne(
        { _id: viewer._id },
        { $push: { listings: insertedListingId } }
      );

      const insertedListing = await db.listings.findOne({
        _id: insertedListingId
      });

      if(!insertedListing){
        throw new Error("Something is wrong with << insertedListingId >> code in the server. Please review! ");
       }

      return insertedListing;


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
  