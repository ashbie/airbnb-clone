import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Affix, Layout, List, Typography } from "antd";
import { ErrorBanner, ListingCard } from "../../lib/components";
import { LISTINGS } from "../../lib/graphql/queries";
import {
  Listings as ListingsData,
  ListingsVariables
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { ListingsFilters, ListingsPagination, ListingsSkeleton } from "./components";


const { Content } = Layout;
const { Paragraph, Text, Title } = Typography;

const PAGE_LIMIT = 4;

export const Listings =() => {
  let { location } = useParams();
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);
  const locationRef = useRef(location);
  if( location === undefined){
    location = "";
  }
  
  
  
  const { loading, data, error } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
    skip: locationRef.current !== location && page !== 1,
    variables: {
      location: location,
      filter,
      limit: PAGE_LIMIT,
      page
    }
  });

  useEffect(() => {
    setPage(1);
    locationRef.current = location;
  }, [location]);

  if (loading) {
    return (
      <Content className="listings">
        <ListingsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description="Soit nous n'avons rien trouvé correspondant à votre recherche, soit nous avons rencontré une erreur. Si vous recherchez un emplacement unique, essayez à nouveau d'effectuer une recherche avec des mots-clés plus courants." />
        <ListingsSkeleton />
      </Content>
    );
  }

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <div>
        <Affix offsetTop={64}>
          <ListingsPagination
            total={listings.total}
            page={page}
            limit={PAGE_LIMIT}
            setPage={setPage}
          />
          <ListingsFilters filter={filter} setFilter={setFilter} />
        </Affix>
        <List
          grid={{gutter: 8,
            xs: 1,
            sm: 2,
            md:3,
            lg: 3,
            xl:4,
            xxl: 4
          }}
          dataSource={listings.result}
          renderItem={listing => (
            <List.Item>
              <ListingCard listing={listing} />
            </List.Item>
          )}
        />
      </div>
    ) : (
      <div>
        <Paragraph>
        Il semble qu'aucune annonce n'ait encore été créée pour{" "}
          <Text mark>"{listingsRegion}"</Text>
        </Paragraph>
        <Paragraph>
        Soyez la première personne à créer une <Link to="/host">annonce dans ce domaine</Link>!
        </Paragraph>
      </div>
    );

  const listingsRegionElement = listingsRegion ? (
    <Title level={3} className="listings__title">
      Résultats pour "{listingsRegion}"
    </Title>
  ) : null;

  return (
    <Content className="listings">
      {listingsRegionElement}
      {listingsSectionElement}
    </Content>
  );
};