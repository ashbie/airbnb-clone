import { IResolvers } from "@graphql-tools/utils";
import { DatabaseCollection, Listing, Booking } from "../../../lib/types";

export const bookingResolvers: IResolvers = {
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },
    listing: (
      booking: Booking,
      _args: Record<string, never>,
      { db }: { db: DatabaseCollection }
    ): Promise<Listing | null> => {
      return db.listings.findOne({ _id: booking.listing });
    }
  }
};
