import  ApolloClient  from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import React from 'react';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Listings  } from './sections';

const client = new ApolloClient({ uri: "/api" });

const root = createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ApolloProvider client={ client }>
  
    <Listings title="JourParJour Listings"/>
  
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
