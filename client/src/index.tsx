import  ApolloClient  from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Home, Host, Listing, Listings, NotFound, User, SimpleTest  } from './sections';
import "./styles/index.css";

const client = new ApolloClient({ uri: "/api" });

const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<Home/>} />
        <Route path="/host"  element={<Host/>} />
        <Route path="/listing/:id"  element={<Listing/>} />
        <Route path="/listings" element={<Listings/>} />
        <Route path="/listings/:location"  element={<Listings/>} />
        <Route path="/user/:id"  element={<User/>} />
        <Route path="/simpletest"  element={<SimpleTest  title='Un test facile'/>} />
        <Route  path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ApolloProvider client={ client }>
  
    <App/>
  
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
