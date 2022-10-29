import  ApolloClient  from 'apollo-boost';
import { ApolloProvider, useMutation } from 'react-apollo';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { AppHeader, Home, Host, Listing, Listings, NotFound, User, Login, Stripe } from './sections';
import { Layout, Affix, Spin } from "antd";
import { Viewer } from "./lib/types";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components"
import { LOG_IN } from './lib/graphql/mutations';
import { LogIn as LogInData, LogInVariables } from './lib/graphql/mutations/LogIn/__generated__/LogIn';
import "./styles/index.css";

const client = new ApolloClient({ 
  uri: "/api",
  request: async operation => {
    const token = sessionStorage.getItem("token");
    operation.setContext({
      headers: {
        "X-CSRF-TOKEN": token || ""
      }
    })
  } 
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [ logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: data => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token);
        } else {
          sessionStorage.removeItem("token");
        }
      }
    }
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Lancement de Jour-Par-Jour" />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="Nous n'avons pas pu vérifier si vous étiez connecté. Veuillez réessayer plus tard !" />
  ) : null;

  return(
    <BrowserRouter>
    <Layout id="app">
      { logInErrorBannerElement }
      <Affix offsetTop={0}  className="app__affix-header">
      <AppHeader viewer={viewer}  setViewer={setViewer} ></AppHeader>
      </Affix>
      <Routes>
        <Route path="/"  element={<Home/>} />
        <Route path="/host"  element={<Host/>} />
        <Route path="/listing/:id"  element={<Listing/>} />
        <Route path="/listings" element={<Listings/>} />
        <Route path="/listings/:location"  element={<Listings/>} />
        <Route path="/user/:id"  element={<User  viewer={viewer} setViewer={setViewer} />} />
        <Route path="/login"  element={<Login viewer={viewer} setViewer={setViewer} />} />
        <Route path="/stripe"  element={<Stripe viewer={viewer} setViewer={setViewer} />} />
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
