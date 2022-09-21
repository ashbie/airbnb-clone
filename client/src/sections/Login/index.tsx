import React from "react";
import { Card, Layout, Typography } from "antd";

// Image Assets
import googleLogo from "./assets/google_logo.jpg";

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login = () => {
  return (
    <Content className="log-in">
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
        <button className="log-in-card__google-button">
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
