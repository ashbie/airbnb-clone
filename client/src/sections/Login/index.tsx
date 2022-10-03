import React, { useEffect, useRef } from "react";
import { Card, Layout, Typography, Spin } from "antd";
import { Navigate  } from "react-router-dom";
import { useApolloClient, useMutation  } from "@apollo/react-hooks";
import { Viewer } from "../../lib/types";
import { AUTH_URL } from "../../lib/graphql/queries";
import { LOG_IN } from "../../lib/graphql/mutations";
import {
  LogIn as LogInData,
  LogInVariables
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { ErrorBanner } from "../../lib/components/ErrorBanner";
import { displaySuccessNotification, displayErrorMessage } from "../../lib/utils";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";

// Image Assets
import googleLogo from "./assets/google_logo.jpg";


interface Props {
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();

  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError }
  ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn && data.logIn.token) {
        setViewer(data.logIn);
        sessionStorage.setItem("token", data.logIn.token);
        displaySuccessNotification("Vous êtes connecté avec succès !");
      }
    }
  });
  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code }
        }
      });
    }
  }, []);


  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL
      });
      window.location.href = data.authUrl;
    } catch {
      displayErrorMessage(
        "Pardon! Nous n'avons pas pu vous connecter. Veuillez réessayer plus tard !"
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="En train de vous connecter..." />
      </Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Navigate to={`/user/${viewerId}`} />;
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="Pardon! Nous n'avons pas pu vous connecter. Veuillez réessayer plus tard !" />
  ) : null;


  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
          Connectez-vous à Jour-par-Jour !
          </Title>
          <Text>Connectez-vous avec Google pour commencer à réserver les locations disponibles !</Text>
        </div>
        <button className="log-in-card__google-button" onClick={handleAuthorize}>
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">Connectez-vous avec Google</span>
        </button>
        <Text type="secondary">
        Remarque : En vous connectant, vous serez redirigé vers le formulaire de consentement Google pour vous connecter avec votre compte Google.
        </Text>
      </Card>
    </Content>
  );
};
