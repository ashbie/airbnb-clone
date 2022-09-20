import { MongoClient, ServerApiVersion } from "mongodb";
import { DatabaseCollection, Booking, ProductionListing, User } from "../lib/types";



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.0ebgboa.mongodb.net/?retryWrites=true&w=majority`;


export const connectDatabase = async (): Promise<DatabaseCollection> => {
    const options = { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 };
    const client = await MongoClient.connect(uri, options);

    const db = client.db('main');

    return {
        listings: db.collection('test_listings'),
        users: db.collection<User>('users'),
        productionListings: db.collection<ProductionListing>('production_listings'),
        bookings: db.collection<Booking>('bookings')
    }
}