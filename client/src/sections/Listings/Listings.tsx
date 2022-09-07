import React from 'react';
import { server } from "../../lib"
import { ListingData, DeleteListingData, DeleteListingVariables } from './types';

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

    const fetchListings = async () => {
        const { data } = await server.fetch<ListingData>({ query: LISTINGS});
        console.log(data);
        
    }

    const DeleteListing = async () => {
        const { data } = await server.fetch<DeleteListingData, DeleteListingVariables>({ 
            query: DELETE_LISTING,
            variables: {
                id: "6316e3dd5b030f3174cb4084"
            }
        });
        console.log(data);
    }

    return <div>
            <h1>{ props.title }</h1>
            <button onClick={ fetchListings }>Query Listings!</button>
            <button onClick={ DeleteListing }>Delete a Listing!</button>
            </div>;
}