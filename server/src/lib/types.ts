import { Collection, ObjectId } from "mongodb";

// ======================================================================
//                             For the Test
// ======================================================================
/*
export interface Listing {
    _id: ObjectId;
    title: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
    numOfBeds: number;
    numOfBaths: number;
    rating: number;
}
*/
// ======================================================================
//                          For Production 
// ======================================================================

export interface Viewer {
    _id?: string;
    token?: string;
    avatar?: string;
    walletId?: string;
    didRequest: boolean;
}

export enum ListingType {
    Apartment = "APARTMENT",
    House = "HOUSE"
}

export interface BookingsIndexMonth {
    [key: string]: boolean;
}

export interface BookingsIndexYear {
    [key: string]: BookingsIndexMonth;
}

export interface BookingsIndex {
    [key: string]: BookingsIndexYear;
}

export interface User{
    _id: string;  // Google's OAuth returns a string, so I won't use mongoDB's ObjectID
    token: string;  // For the login session token provided by Google's OAuth
    name: string;
    avatar: string;
    contact: string;
    walletId?: string;
    income: number;
    bookings: ObjectId[];
    listings: ObjectId[];
}

export interface Listing{
    _id: ObjectId;
    title: string;
    description: string;
    image: string;
    host: string;
    type: ListingType;
    address: string;
    country: string;
    admin: string;
    city: string;
    bookings: ObjectId[];
    bookingsIndex: BookingsIndex;
    price: number;
    numOfGuests: number;
}

export interface Booking{
    _id: ObjectId;
    listing: ObjectId;
    tenant: string;
    checkIn: string;
    checkOut: string;
}

// ======================================================================
//                              Key
// ======================================================================
/*
        listings :  this collection contains the simple test listings
        productionListings: this collection contains the (vrai) lisings used in the production app
*/


export interface DatabaseCollection {
    //listings: Collection<Listing>;
    users: Collection<User>;
    listings: Collection<Listing>;
    bookings: Collection<Booking>;
}