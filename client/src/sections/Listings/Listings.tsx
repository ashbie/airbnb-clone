import { useQuery, useMutation } from "react-apollo";
import { Avatar, Alert, List, Button, Spin } from "antd";
import { gql } from "apollo-boost";
import { Listings as ListingData } from "./__generated__/Listings";
import { Delete_a_listing as DeleteListingData, Delete_a_listingVariables as DeleteListingVariables } from "./__generated__/Delete_a_listing";
import "./styles/Listings.css";
import { ListingsSkeleton } from "./components";


const LISTINGS = gql`
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

const DELETE_LISTING = gql`
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
        deleteListing({ variables: { id }});

        refetch();
        
    }

    const listings = data ? data.listings : null;

    const theListingsList = listings?(
    <List
        itemLayout="horizontal"
        dataSource={listings}
        renderItem={(listing) => (
            <List.Item actions={[ <Button type="primary" onClick={()=>handleDeleteListing(listing.id)}>Supprimer</Button>]}>
                <List.Item.Meta
                avatar={<Avatar src={listing.image} shape="square" size={48} />}
                title={listing.title}
                description={listing.address}
                />
            </List.Item>
        )}
    />
    ) : null ;


    if(loading){
        return <div className="listing">
            <ListingsSkeleton title="Jour-par-Jour Listings" />
        </div>;
    }

    if(error){
        return <div className="listing">
        <ListingsSkeleton title="Jour-par-Jour Listings"  error/>
    </div>;
}

    
    const deleteListingErrorMessage = deleteListingError ? (<Alert message="Oh oh! Quelque chose c'est mal passé. Merci d'essayer plus tard! :(" type="error" className="listings-error-method-1"></Alert>) : null;
    
    
    return <div className="listing">
        <Spin spinning={deleteListingLoading}>
            { deleteListingErrorMessage }
            <h1>{ props.title }</h1>
            { theListingsList }
            
        </Spin>
    </div>;
}