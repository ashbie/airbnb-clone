import React from "react";
import { List, Typography } from "antd";
import { ListingCard } from "../../../../lib/components";
import { User } from "../../../../lib/graphql/queries/User/__generated__/User";

interface Props {
  userListings: User["user"]["listings"];
  listingsPage: number;
  limit: number;
  setListingsPage: (page: number) => void;
}
/*
<Pagination defaultCurrent={listingsPage} total={total} defaultPageSize={limit} 
        hideOnSinglePage={true} 
        showLessItems={true} 
        onChange={(page: number) => setListingsPage(page)}  />
// I used this to verify whether I was getting the correct information
<br></br>
        total={total}<br></br>
        listingsPage={listingsPage}<br></br>
        limit={limit}<br></br>
*/

const { Paragraph, Title } = Typography;

export const UserListings = ({
  userListings,
  listingsPage,
  limit,
  setListingsPage
}: Props) => {
  const { total, result } = userListings;

  const userListingsList = (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 4
      }}
      dataSource={result}
      locale={{ emptyText: "L'utilisateur n'a pas encore d'annonce !" }}
      pagination={{
        position: "top",
        current: listingsPage,
        total,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setListingsPage(page)
      }}
      renderItem={userListing => (
        <List.Item>
          <ListingCard listing={userListing} />
        </List.Item>
      )}
    />
  );
  
  
  return (
    <div className="user-listings">
      <Title level={4} className="user-listings__title">
        Listings
      </Title>
      <Paragraph className="user-listings__description">
      Cette section met en évidence les annonces que cet utilisateur héberge
       actuellement et a mises à disposition pour les réservations.        
      </Paragraph>
      {userListingsList}
    </div>
  );
};
