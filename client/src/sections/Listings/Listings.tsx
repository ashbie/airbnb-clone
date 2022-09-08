import React, { useState, useEffect } from 'react';
import { server, useQuery } from "../../lib"
import { Listing, ListingData, DeleteListingData, DeleteListingVariables } from './types';

const LISTINGS = `
    query Listings{
        listings{
            id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            numOfBaths
            rating
        }
    }
`;

const DELETE_LISTING = `
    mutation Delete_a_listing($id: ID!) {
        deleteListing(id: $id){
            id
        }
    }
`;

interface Props{
    title: string;
}

export const Listings = (props: Props) => {
    const { data } = useQuery<ListingData>(LISTINGS);

    const DeleteListing = async ( id: string) => {
        await server.fetch<DeleteListingData, DeleteListingVariables>({ 
            query: DELETE_LISTING,
            variables: {
                id
            }
        });
        
    }

    const listings = data ? data.listings : null;

    const theListingsList = listings?<ul> {
        listings.map((listing) => {
        return <li key={listing.id}>{listing.title} <button onClick={ () => DeleteListing(listing.id) }>Delete</button></li>
    })
    }</ul>: null ;

    return <div>
            <h1>{ props.title }</h1>
            { theListingsList }
            </div>;
}