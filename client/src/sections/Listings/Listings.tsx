import { useQuery, useMutation } from "../../lib"
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
    const { data, loading, error, refetch } = useQuery<ListingData>(LISTINGS);

    const [deleteListing, { loading: deleteListingLoading, error: deleteListingError }] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

    const handleDeleteListing = async ( id: string) => {
        deleteListing({ id });

        refetch();
        
    }

    const listings = data ? data.listings : null;

    const theListingsList = listings?<ul> {
        listings.map((listing) => {
        return <li key={listing.id}>{listing.title} <button onClick={ () => handleDeleteListing(listing.id) }>Delete</button></li>
    })
    }</ul>: null ;

    if(loading){
        return <div><h1>Loading...</h1></div>;
    }

    if(error){
        return <div><h1>Uh oh! Something went wrong - Please try again later! <br/>:(</h1></div>;
    }

    const deleteListingLoadingMessage = deleteListingLoading ? <h2>Deletion in progress...</h2> : null;
    
    const deleteListingErrorMessage = deleteListingError ? <h2>Uh oh! Something went wrong with deleting - please try again later <br/>:(</h2> : null;
    return <div>
            <h1>{ props.title }</h1>
            { theListingsList }
            { deleteListingErrorMessage}
            { deleteListingLoadingMessage }
            </div>;
}