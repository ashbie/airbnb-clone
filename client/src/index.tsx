import  ApolloClient  from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { AppHeader, Home, Host, Listing, Listings, NotFound, User, Login  } from './sections';
import { Layout, Affix } from "antd";
import { Viewer } from "./lib/types";
import "./styles/index.css";

const client = new ApolloClient({ uri: "/api" });

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);

  return(
    <BrowserRouter>
    <Layout id="app">
      <Affix offsetTop={0}  className="app__affix-header">
      <AppHeader viewer={viewer}  setViewer={setViewer} ></AppHeader>
      </Affix>
      <Routes>
        <Route path="/"  element={<Home/>} />
        <Route path="/host"  element={<Host/>} />
        <Route path="/listing/:id"  element={<Listing/>} />
        <Route path="/listings" element={<Listings/>} />
        <Route path="/listings/:location"  element={<Listings/>} />
        <Route path="/user/:id"  element={<User/>} />
        <Route path="/login"  element={<Login setViewer={setViewer} />} />
        <Route  path="*" element={<NotFound/>} />
      </Routes>
    </Layout>
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
